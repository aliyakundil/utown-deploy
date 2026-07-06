import { prisma } from "../../db/prisma.js";
import { unlink } from "node:fs/promises";

import type { CreateUploadDto } from "./upload.types.js";

import { validateCreateUpload } from "./upload.validation.js";

export async function createUpload(
  userId: number,
  file: Express.Multer.File
) {
  const uploadData: CreateUploadDto = {
    fileName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    filePath: file.path,
  };

  const validatedData =
    validateCreateUpload(uploadData);

  return prisma.upload.create({
    data: {
      userId,
      ...validatedData,
    },
  });
}

export async function getUploads(
  userId: number
) {
  return prisma.upload.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUpload(
  uploadId: number,
  userId: number
) {
  const upload = await prisma.upload.findFirst({
    where: {
      id: uploadId,
      userId,
    },
  });

  if (!upload) {
    throw new Error("File not found");
  }

  return upload;
}

export async function deleteUpload(
  uploadId: number,
  userId: number
) {
  const upload = await prisma.upload.findFirst({
    where: {
      id: uploadId,
      userId,
    },
  });

  if (!upload) {
    throw new Error("File not found");
  }

  try {
    await unlink(upload.filePath);
  } catch {
    // Файл уже отсутствует
  }

  await prisma.upload.delete({
    where: {
      id: uploadId,
    },
  });

  return {
    message: "File deleted successfully",
  };
}