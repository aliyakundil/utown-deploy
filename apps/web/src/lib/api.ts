import axios, { type InternalAxiosRequestConfig } from "axios";
import { refreshSocketToken } from "./socket";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string> | null = null;

// интерсептор
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
        .post<{ success: boolean; data: { accessToken: string } }>(
          "/auth/refresh",
        )
        .then(({ data }) => {
          const newAccessToken = data.data?.accessToken;

          if (!newAccessToken) {
            throw new Error("Refresh response has no accessToken");
          }

          localStorage.setItem("accessToken", newAccessToken);
          refreshSocketToken();

          return newAccessToken;
        })
        .finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.set(
        "Authorization",
        `Bearer ${newAccessToken}`,
      );

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;