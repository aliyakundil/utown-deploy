import api from "../../../lib/api";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

export async function login(data: LoginRequest) {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data,
  );

  return response.data;
}

export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
}