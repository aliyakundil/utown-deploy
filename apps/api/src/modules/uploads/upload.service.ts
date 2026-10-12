import { prisma } from "../../db/prisma.js";
import crypto from "node:crypto";
import path from "node:path";

import { uploadToS3, deleteFromS3 } from "../../lib/s3.js";

import type { CreateUploadDto } from "./upload.types.js";

import { validateCreateUpload } from "./upload.validation.js";

export async function createUpload(
  userId: number,
  file: Express.Multer.File
) {
  const key = `${userId}/${Date.now()}-${crypto.randomUUID()}${path.extname(
    file.originalname
  )}`;

  const url = await uploadToS3(key, file.buffer, file.mimetype);

  const uploadData: CreateUploadDto = {
    fileName: path.basename(key),
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    filePath: key,
    url,
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
    await deleteFromS3(upload.filePath);
  } catch {
    // Файл уже отсутствует в S3
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
