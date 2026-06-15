export interface RegisterDto {
  name: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  phone: string;
  password: string;
}

export type UserRole = "USER" | "ADMIN";

export interface JwtPayload {
  id: number;
  role: UserRole;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    phone: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken: string;
}