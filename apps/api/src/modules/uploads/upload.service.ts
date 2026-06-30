import { prisma } from "../../db/prisma.js";

import type { CreateUploadDto } from "./upload.types.js";

import { validateCreateUpload } from "./upload.validation.js";

export async function createUpload(
  userId: number,
  file: Express.Multer.File
) {
  return prisma.upload.create({
    data: {
      userId,

      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
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

  await prisma.upload.delete({
    where: {
      id: uploadId,
    },
  });

  return {
    message: "File deleted successfully",
  };
}