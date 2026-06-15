import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../modules/auth/auth.types.js"

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_SECRET) {
  throw new Error("Missing ACCESS_TOKEN_SECRET");
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, ACCESS_SECRET!) as unknown as JwtPayload;

    req.user = decoded; 

    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}