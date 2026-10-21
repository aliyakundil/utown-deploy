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

const excludedAuthEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify-code",
  "/auth/resend-code",
  "/auth/forgot-password",
  "/auth/reset-password",
];

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
      | InternalAxiosRequestConfig
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest 
    ) {
      return Promise.reject(error);
    }

    const requestPath = (originalRequest.url ?? "").split("?")[0];

    const isExcludedAuthRequest = excludedAuthEndpoints.some(
      (endpoint) =>
        requestPath === endpoint ||
        requestPath.endsWith(endpoint),
    );

    const hasAuthorization = Boolean(
      originalRequest.headers?.Authorization,
    );

    if (
      !hasAuthorization ||
      isExcludedAuthRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
        .post<{ accessToken: string } | { data: { accessToken: string } }>(
            "/auth/refresh",
        )
        .then(({ data }) => {
          const accessToken =
              "data" in data ? data.data.accessToken : data.accessToken;

          if (!accessToken) {
            throw new Error("Refresh response has no accessToken");
          }

          localStorage.setItem("accessToken", accessToken);
          refreshSocketToken();

          return accessToken;
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
      const refreshStatus = axios.isAxiosError(refreshError)
        ? refreshError.response?.status
        : undefined;

      if (refreshStatus === 401 || refreshStatus === 403) {
        localStorage.removeItem("accessToken");

        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;