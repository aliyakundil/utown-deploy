import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma.js";
import type { RegisterDto, LoginDto, JwtPayload, AuthResponse, RefreshTokenResponse } from "./auth.types.js";
import { validateRegister, validateLogin } from "./auth.validation.js";
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

export async function register(data: RegisterDto): Promise<AuthResponse> {
  const { /*name,*/ phone, password, role } = validateRegister(data);

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
        name: "",
        phone,
        role: role ?? "CLIENT",
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
      name: user.name ?? null,
      phone: user.phone,
      role: user.role as UserRole,
    },
    ...tokens,
  };
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  const { phone, password } = validateLogin(data);

  const user = await prisma.user.findUnique({
    where: {
      phone
    }
  })

  if (!user) {
    throw new Error("Invalid phone or password")
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