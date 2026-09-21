import type { Restaurant } from "../../restaurants/types/restaurant.types";

export interface Favorite {
  id: number;
  userId: number;
  restaurantId: number;
  restaurant: Restaurant;
}

export interface FavoritesResponse {
  success: boolean;
  data: Favorite[];
}
