import type { Request, Response } from "express";

import * as uploadService from "./upload.service.js";

export async function uploadFile(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user!.id;

    if (!req.file) {
      throw new Error("File is required");
    }

    const result =
      await uploadService.createUpload(
        userId,
        req.file
      );

    return res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}


export async function getUploads(
  req: Request,
  res: Response
) {
  try {
    const result =
      await uploadService.getUploads(
        req.user!.id
      );

    res.json({
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


export async function deleteUpload(
  req: Request,
  res: Response
) {
  try {
    await uploadService.deleteUpload(
      Number(req.params.id),
      req.user!.id
    );

    res.json({
      success: true,
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