import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";

const REFRESH_COOKIE_NAME = "refreshToken";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response) {
  
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    const result = await authService.refresh(refreshToken);

    res.cookie(
      REFRESH_COOKIE_NAME,
      result.refreshToken,
      refreshCookieOptions
    );

    res.status(200).json({
      success: true,
      data: { accessToken: result.accessToken },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function verifyCode(
  req: Request,
  res: Response
) {
  try {
    const result = await authService.verifyCode(req.body);
    const { refreshToken, ...data } = result;

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const result = await authService.requestPasswordReset(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const result = await authService.resetPassword(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    const { refreshToken, ...data } = result;

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    let field: "phone" | "password" | "general" = "general";

    switch (message) {
      case "Phone is required":
      case "Invalid phone number format":
        field = "phone";
        break;

      case "Password is required":
        field = "password";
        break;

      default:
        field = "general";
    }

    console.log({ field, message });

    res.status(400).json({
      success: false,
      field,
      error: message,
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    await authService.logout(userId);

    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}