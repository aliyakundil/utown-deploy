import api from "../../../lib/api";
import type {
  MyRestaurantsResponse,
  RestaurantOrdersResponse,
  CreateCategoryRequest,
  CategoryResponse,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  MenuItemResponse,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  MyRestaurantResponse,
} from "../types/restaurateur.types";

export async function getMyRestaurants() {
  const response = await api.get<MyRestaurantsResponse>("/restaurants/mine");
  return response.data;
}

export async function getRestaurantOrders(restaurantId: number) {
  const response = await api.get<RestaurantOrdersResponse>(
    `/orders/restaurant/${restaurantId}`
  );
  return response.data;
}

export async function createCategory(
  restaurantId: number,
  data: CreateCategoryRequest
) {
  const response = await api.post<CategoryResponse>(
    `/categories/restaurant/${restaurantId}`,
    data
  );
  return response.data;
}

export async function deleteCategory(categoryId: number) {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
}

export async function createMenuItem(
  categoryId: number,
  data: CreateMenuItemRequest
) {
  const response = await api.post<MenuItemResponse>(
    `/menu-items/category/${categoryId}`,
    data
  );
  return response.data;
}

export async function updateMenuItem(
  menuItemId: number,
  data: UpdateMenuItemRequest
) {
  const response = await api.patch<MenuItemResponse>(
    `/menu-items/${menuItemId}`,
    data
  );
  return response.data;
}

export async function deleteMenuItem(menuItemId: number) {
  const response = await api.delete(`/menu-items/${menuItemId}`);
  return response.data;
}

export async function createRestaurant(data: CreateRestaurantRequest) {
  const response = await api.post<MyRestaurantResponse>("/restaurants", data);
  return response.data;
}

export async function updateRestaurant(
  restaurantId: number,
  data: UpdateRestaurantRequest
) {
  const response = await api.patch<MyRestaurantResponse>(
    `/restaurants/${restaurantId}`,
    data
  );
  return response.data;
}
