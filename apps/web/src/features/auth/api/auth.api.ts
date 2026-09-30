import api from "../../../lib/api";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyCodeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MessageResponse,
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

export async function verifyCode(
  data: VerifyCodeRequest
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/verify-code",
    data
  );

  return response.data;
}

export async function resendCode(
  data: ForgotPasswordRequest
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/auth/resend-code",
    data
  );

  return response.data;
}

export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/auth/forgot-password",
    data
  );

  return response.data;
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    "/auth/reset-password",
    data
  );

  return response.data;
}
