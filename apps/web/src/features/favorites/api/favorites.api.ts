import api from "../../../lib/api";
import type { FavoritesResponse } from "../types/favorite.types";

export async function getFavorites() {
  const response = await api.get<FavoritesResponse>("/favorites");
  return response.data;
}

export async function addFavorite(restaurantId: number) {
  const response = await api.post("/favorites", { restaurantId });
  return response.data;
}

export async function removeFavorite(restaurantId: number) {
  const response = await api.delete(`/favorites/${restaurantId}`);
  return response.data;
}
