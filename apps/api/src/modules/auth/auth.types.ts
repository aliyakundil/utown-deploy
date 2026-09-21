import type { UserRole } from "@prisma/client";

export interface JwtPayload {
  id: number;
  role: UserRole;
}

export interface RegisterDto {
  name?: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  phone: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface AuthUserResponse {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyCodeDto {
  phone: string;
  code: string;
}

export interface ForgotPasswordDto {
  phone: string;
}

export interface ResetPasswordDto {
  phone: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  newPassword: string;
}