import api from "./api";

export interface UploadResponse {
  success: boolean;
  data: {
    id: number;
    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    filePath: string;
    url?: string;
    createdAt: string;
  };
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadResponse>("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export function resolveUploadUrl(fileName: string) {
  const origin = import.meta.env.VITE_API_URL.replace("/api", "");
  return `${origin}/uploads/${fileName}`;
}