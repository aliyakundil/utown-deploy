import type { CreateUploadDto } from "./upload.types.js";

export function validateCreateUpload(
  data: CreateUploadDto
) {
  const fileName = data.fileName.trim();
  const originalName = data.originalName.trim();
  const mimeType = data.mimeType.trim();
  const filePath = data.filePath.trim();

  if (!fileName) {
    throw new Error("File name is required");
  }

  if (!originalName) {
    throw new Error("Original name is required");
  }

  if (!mimeType) {
    throw new Error("Mime type is required");
  }

  if (data.fileSize <= 0) {
    throw new Error("Invalid file size");
  }

  if (!filePath) {
    throw new Error("File path is required");
  }

  return {
    fileName,
    originalName,
    mimeType,
    fileSize: data.fileSize,
    filePath,
  };
}