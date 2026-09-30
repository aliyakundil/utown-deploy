import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import type { RegisterDto, LoginDto, JwtPayload, AuthResponse, RegisterResponse, RefreshTokenResponse, VerifyCodeDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from "./auth.types.js";
import { validateRegister, validateLogin, validateVerificationCode, validateForgotPassword, validateResetPassword, validateChangePassword } from "./auth.validation.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";
import { sendVerificationCode } from "../../services/sms.service.js";
import type { UserRole } from "@prisma/client";
import crypto from "node:crypto";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

const ACCESS_SECRET = getEnv("ACCESS_TOKEN_SECRET");
const REFRESH_SECRET = getEnv("REFRESH_TOKEN_SECRET");

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
  const hashedToken = hashRefreshToken(token);
  if (!user || user.refreshToken !== hashedToken) {
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
  const { phone, code } =
    validateVerificationCode(data);

  const verification =
    await prisma.verificationCode.findFirst({
      where: {
        phone,
        code,
      },
    });

  if (!verification) {
    throw new Error("Invalid verification code");
  }

  if (verification.expiresAt < new Date()) {
    throw new Error("Verification code has expired");
  }

  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
    },
  });

  await prisma.verificationCode.delete({
    where: {
      id: verification.id,
    },
  });

  const tokens = issueTokens(
    user.id,
    user.role as UserRole
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: hashRefreshToken(
        tokens.refreshToken
      ),
    },
  });

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
  const { phone } = validateForgotPassword(data);

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (user) {
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
    message: "If this phone number is registered, a reset code has been sent",
  };
}

export async function resetPassword(
  data: ResetPasswordDto
): Promise<{ message: string }> {
  const { phone, code, newPassword } = validateResetPassword(data);

  const verification = await prisma.verificationCode.findFirst({
    where: { phone, code },
  });

  if (!verification) {
    throw new Error("Invalid verification code");
  }

  if (verification.expiresAt < new Date()) {
    throw new Error("Verification code has expired");
  }

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      refreshToken: null,
    },
  });

  await prisma.verificationCode.delete({
    where: { id: verification.id },
  });

  return {
    message: "Password reset successfully",
  };
}

export async function changePassword(
  userId: number,
  data: ChangePasswordDto
): Promise<RefreshTokenResponse> {
  const { newPassword } = validateChangePassword(data);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  const tokens = issueTokens(user.id, user.role as UserRole);

  await prisma.user.update({
    where: { id: user.id },
    data: {
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