import type { StatusRestaurants } from "@prisma/client";

export interface CreateRestaurantDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  status?: StatusRestaurants;
  imageUrl?: string;
  minimumOrder?: number;
}

export interface UpdateRestaurantDto {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  status?: StatusRestaurants;
  imageUrl?: string;
  minimumOrder?: number;
}

export interface RestaurantQueryDto {
  search?: string;
  status?: StatusRestaurants;
  page?: string;
  limit?: string;
}