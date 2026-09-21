import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";

type ErrorField = "phone" | "password" | "general";

function classifyAuthErrorField(message: string): ErrorField {
  switch (message) {
    case "Phone is required":
    case "Invalid phone number format":
    case "Phone number already exists":
      return "phone";

    case "Password is required":
      return "password";

    default:
      if (message.includes("Password")) {
        return "password";
      }

      return "general";
  }
}

export async function register(req: Request, res: Response) {

  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    res.status(400).json({
      success: false,
      field: classifyAuthErrorField(message),
      error: message,
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refresh(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
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

    res.status(200).json({
      success: true,
      data: result,
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

export async function resendCode(req: Request, res: Response) {
  try {
    const result = await authService.resendVerificationCode(req.body);

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

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    res.status(400).json({
      success: false,
      field: classifyAuthErrorField(message),
      error: message,
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await authService.changePassword(userId, req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return res.status(400).json({
      success: false,
      field: classifyAuthErrorField(message),
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