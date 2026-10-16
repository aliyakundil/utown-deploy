import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../modules/auth/auth.types.js";
import { prisma } from "../db/prisma.js";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

const ACCESS_SECRET = getEnv("ACCESS_TOKEN_SECRET");

export function isJwtPayload(payload: unknown): payload is JwtPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const data = payload as Record<string, unknown>;

  return typeof data.id === "number" && typeof data.role === "string";
}


export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token is required",
      });
    }

    const decoded = jwt.verify(token, ACCESS_SECRET);

    if (!isJwtPayload(decoded)) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        isBanned: true,
        deletedAt: true,
      },
    });

    if (!user || user.isBanned || user.deletedAt) {
      return res.status(403).json({
        success: false,
        error: "Account is banned or unavailable",
      });
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    next(error);
  }
}

export function requireRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.sendStatus(401);
    }

    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }

    next();
  };
}