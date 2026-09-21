import api from "../../../lib/api";
import type {
  RestaurantListResponse,
  RestaurantDetailResponse,
} from "../types/restaurant.types";

export async function getRestaurants(search?: string, limit = 20) {
  const response = await api.get<RestaurantListResponse>(
    "/restaurants",
    { params: { search: search || undefined, limit } }
  );

  return response.data;
}

export async function getRestaurantById(id: number) {
  const response = await api.get<RestaurantDetailResponse>(
    `/restaurants/${id}`
  );

  return response.data;
}