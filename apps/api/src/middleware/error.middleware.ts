import multer from "multer";
import type {
  Request,
  Response,
  NextFunction,
} from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File is too large",
      });
    }

    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
}