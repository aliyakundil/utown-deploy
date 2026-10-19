import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import type { RegisterDto, LoginDto, JwtPayload, AuthResponse, RegisterResponse, RefreshTokenResponse, VerifyCodeDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from "./auth.types.js";
import { validateRegister, validateLogin, validateVerificationCode, validateForgotPassword, validateResetPassword, validateChangePassword } from "./auth.validation.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";
import { sendVerificationCode } from "../../services/sms.service.js";
import { sendPasswordResetEmail } from "../../services/email.service.js";
import type { UserRole } from "@prisma/client";
import crypto from "node:crypto";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

const ACCESS_SECRET = getEnv("ACCESS_TOKEN_SECRET");
const REFRESH_SECRET = getEnv("REFRESH_TOKEN_SECRET");
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_BLOCK_DURATION_MS = 10 * 60 * 1000;
export class VerificationBlockedError extends Error {
  constructor(public retryAfter: number) {
    super("Too many incorrect attempts. Try again later");
    this.name = "VerificationBlockedError";
  }
}

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function issueTokens(userId: number, role: UserRole) {
  const payload: JwtPayload = { id: userId, role };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

function hashRefreshToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function register(data: RegisterDto): Promise<RegisterResponse> {
  const { name, phone, password } = validateRegister(data);

  const existingPhone = await prisma.user.findUnique({
    where: { phone },
  });
    
  if (existingPhone) {
    throw new Error("Phone number already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: name ?? "",
        phone,
        role: "CLIENT",
        password: hashedPassword
      }
    })
    
    await tx.cart.create({
      data: {
        userId: createdUser.id
      }
    })

    return createdUser;
  })

  const code = generateVerificationCode();

  await prisma.verificationCode.deleteMany({
    where: {
      phone: user.phone,
    },
  });

  await prisma.verificationCode.create({
    data: {
      phone: user.phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  sendVerificationCode(user.phone, code);

  return {
    message: "Verification code sent",
  };
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  const { phone, password } = validateLogin(data);

  const user = await prisma.user.findFirst({
    where: {
      phone,
      deletedAt: null,
    }
  })

  if (!user) {
    throw new Error("Invalid phone or password")
  }

  if (!user.isVerified) {
    throw new Error("Phone number is not verified");
  }

  if (user.isBanned) {
    throw new Error("Your account has been suspended");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  )

  if (!isPasswordValid) {
    throw new Error("Invalid phone or password");
  }

  const tokens = issueTokens(user.id, user.role as UserRole);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashRefreshToken(tokens.refreshToken),
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role as UserRole,
    },
    ...tokens,
  };
}

export async function refresh(token: string): Promise<RefreshTokenResponse> {
  if (!token) {
    throw new Error("Refresh token is required");
  }
  let decoded: JwtPayload;
  try {
    const verified = jwt.verify(token, REFRESH_SECRET);
    if (
      typeof verified !== "object" ||
      verified === null ||
      typeof verified.id !== "number" ||
      typeof verified.role !== "string"
    ) {
      throw new Error("Invalid refresh token payload");
    }
    decoded = verified as JwtPayload;
  } catch {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (
    !user ||
    user.isBanned ||
    user.deletedAt ||
    user.refreshToken !== hashRefreshToken(token)
  ) {
    throw new Error("Invalid refresh token");
  }

  const tokens = issueTokens(user.id, user.role);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashRefreshToken(tokens.refreshToken),
    },
  });
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}



export async function verifyCode(
  data: VerifyCodeDto
): Promise<AuthResponse> {
  const { phone, code } 
    = validateVerificationCode(data);
  const now = new Date();

  const attempt = await prisma.verificationAttempt.findUnique({
    where: { phone },
  });

  if (attempt?.blockedUntil && attempt.blockedUntil > now) {
    const retryAfter = Math.ceil(
      (attempt.blockedUntil.getTime() - now.getTime()) / 1000
    );

    throw new VerificationBlockedError(retryAfter);
  }

  if (attempt?.blockedUntil && attempt.blockedUntil <= now) {
    await prisma.verificationAttempt.update({
      where: { phone },
      data: {
        failedAttempts: 0,
        blockedUntil: null,
      },
    });
  }

  const verification = await prisma.verificationCode.findFirst({
    where: {
      phone,
      expiresAt: { gt: now },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!verification) {
    throw new Error("Invalid verification code");
  }

  if (verification.code !== code) {
    const updatedAttempt = await prisma.verificationAttempt.upsert({
      where: { phone },
      create: {
        phone,
        failedAttempts: 1,
        blockedUntil: null,
      },
      update: {
        failedAttempts: { increment: 1 },
      },
    });

    const shouldBlock =
      updatedAttempt.failedAttempts >= MAX_VERIFICATION_ATTEMPTS;

    if (shouldBlock) {
      const blockedUntil = new Date(
        Date.now() + VERIFICATION_BLOCK_DURATION_MS
      );

      await prisma.verificationAttempt.update({
        where: { phone },
        data: { blockedUntil },
      });

      const retryAfter = Math.ceil(
        (blockedUntil.getTime() - Date.now()) / 1000
      );

      throw new VerificationBlockedError(retryAfter);
    }

    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: {
        attempts: { increment: 1 },
      },
    });

    throw new Error("Invalid verification code");
  }

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const tokens = issueTokens(user.id, user.role as UserRole);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        refreshToken: hashRefreshToken(tokens.refreshToken),
      },
    }),
    prisma.verificationCode.delete({
      where: { id: verification.id },
    }),
    prisma.verificationAttempt.deleteMany({
      where: { phone },
    }),
  ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
    ...tokens,
  };
}

export async function resendVerificationCode(
  data: ForgotPasswordDto
): Promise<{ message: string }> {
  const { phone } = validateForgotPassword(data);

  if (!phone) {
    throw new Error("Phone is required");
  }

  const now = new Date();

  const attempt = await prisma.verificationAttempt.findUnique({
    where: { phone },
  });

  if (attempt?.blockedUntil && attempt.blockedUntil > now) {
    const retryAfter = Math.ceil(
      (attempt.blockedUntil.getTime() - now.getTime()) / 1000
    );

    throw new VerificationBlockedError(retryAfter);
  }

  if (attempt?.blockedUntil && attempt.blockedUntil <= now) {
    await prisma.verificationAttempt.update({
      where: { phone },
      data: {
        failedAttempts: 0,
        blockedUntil: null,
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (user && !user.isVerified) {
    const code = generateVerificationCode();

    await prisma.verificationCode.deleteMany({
      where: { phone },
    });

    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    sendVerificationCode(phone, code);
  }

  return {
    message: "If this phone number has a pending verification, a new code has been sent",
  };
}

export async function requestPasswordReset(
  data: ForgotPasswordDto
): Promise<{ message: string }> {
  const { phone, email } = validateForgotPassword(data);

  const identifierWhere = phone ? { phone } : { email: email as string };

  const user = await prisma.user.findFirst({
    where: identifierWhere,
  });

  if (user) {
    const code = generateVerificationCode();

    await prisma.verificationCode.deleteMany({
      where: identifierWhere,
    });

    await prisma.verificationCode.create({
      data: {
        phone: phone ?? null,
        email: email ?? null,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    if (phone) {
      sendVerificationCode(phone, code);
    } else if (email) {
      try {
        await sendPasswordResetEmail(email, code);
      } catch (error) {
        console.error("Failed to send password reset email:", error);
      }
    }
  }

  return {
    message: "If this account exists, a reset code has been sent",
  };
}


export async function resetPassword(
  data: ResetPasswordDto
): Promise<{ message: string }> {
  const { phone, email, code, newPassword } = validateResetPassword(data);

  const identifierWhere = phone ? { phone } : { email: email as string };

  const verification = await prisma.verificationCode.findFirst({
    where: {
      ...identifierWhere,
      expiresAt: { gt: new Date() },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!verification) {
    throw new Error("Invalid or expired verification code");
  }

  if (verification.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    throw new Error("Too many incorrect attempts. Request a new code");
  }

  if (verification.code !== code) {
    const updated = await prisma.verificationCode.updateMany({
      where: {
        id: verification.id,
        attempts: { lt: MAX_VERIFICATION_ATTEMPTS },
      },
      data: {
        attempts: { increment: 1 },
      },
    });

    if (updated.count === 0) {
      throw new Error("Too many incorrect attempts. Request a new code");
    }

    throw new Error("Invalid verification code");
    
  }

  const user = await prisma.user.findFirst({
    where: identifierWhere,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, refreshToken: null },
    }),
    prisma.verificationCode.delete({
      where: { id: verification.id },
    }),
  ]);

  return { message: "Password reset successfully" };
}


export async function changePassword(
  userId: number,
  data: ChangePasswordDto
): Promise<RefreshTokenResponse> {
  const { currentPassword, newPassword } = validateChangePassword(data);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const tokens = issueTokens(user.id, user.role as UserRole);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      refreshToken: hashRefreshToken(tokens.refreshToken),
    },
  });

  return tokens;
}

export async function logout(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
    },
  });

  return {
    success: true,
  };
}