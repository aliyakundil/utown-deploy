export type UserRole =
  | "CLIENT"
  | "RESTAURATEUR"
  | "ADMIN";

export type ErrorField =
  | "phone"
  | "password"
  | "general";

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
}

export interface AuthData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  data: AuthData;
}

export interface ApiErrorResponse {
  success: false;
  field: ErrorField;
  error: string;
}