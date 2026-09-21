import type { CreateFavoriteDto } from "./favorite.types.js";

export function validateCreateFavorite(
  data: CreateFavoriteDto
) {
  if (!data.restaurantId) {
    throw new Error("Restaurant id is required");
  }

  return {
    restaurantId: Number(data.restaurantId),
  };
}