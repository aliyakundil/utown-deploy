import type { UserRole } from "@prisma/client";

export interface CreateUserByAdminDto {
  username: string;
  phone: string;
  password?: string;
  email?: string | null;
  address?: string;
  role?: UserRole;
}

export interface UpdateUserByAdminDto {
  username?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  imageUrl?: string;
  role?: UserRole;
}

export interface GetUsersOptions {
  page?: string;
  limit?: string;
  search?: string;
}