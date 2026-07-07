export interface CreateUploadDto {
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
}