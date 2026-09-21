import type { StatusRestaurants } from "@prisma/client";

export interface DayHours {
  isClosed: boolean;
  open?: string;
  close?: string;
  [key: string]: boolean | string | undefined;
}

export type WorkingHours = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  DayHours
>;

export interface CreateRestaurantDto {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  status?: StatusRestaurants;
  imageUrl?: string;
  minimumOrder?: number;
  category?: string;
  deliveryArea?: string;
  workingHours?: WorkingHours;
}

export interface UpdateRestaurantDto {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  status?: StatusRestaurants;
  imageUrl?: string;
  minimumOrder?: number;
  category?: string;
  deliveryArea?: string;
  workingHours?: WorkingHours;
}

export interface RestaurantQueryDto {
  search?: string;
  status?: StatusRestaurants;
  page?: string;
  limit?: string;
}
