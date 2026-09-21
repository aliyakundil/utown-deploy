import api from "../../../lib/api";
import type {
  AdminUsersResponse,
  AdminOrdersResponse,
  UserRole,
  CreateClientRequest,
  AdminUserResponse,
} from "../types/admin.types";
import type {
  RestaurantListResponse,
  RestaurantDetailResponse,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  CategoryListResponse,
  CategoryDetailResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  MenuItemListResponse,
  MenuItemDetailResponse,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from "../../restaurants/types/restaurant.types";

export async function getAllUsers(page = 1, search?: string) {
  const response = await api.get<AdminUsersResponse>("/admin/users", {
    params: { page, search: search || undefined },
  });

  return response.data;
}

export async function updateUserRole(userId: number, role: UserRole) {
  const response = await api.patch(`/admin/users/${userId}`, { role });
  return response.data;
}

export async function deleteUser(userId: number) {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
}

export async function getAllOrders(page = 1) {
  const response = await api.get<AdminOrdersResponse>("/admin/orders", {
    params: { page },
  });

  return response.data;
}

export async function getAllRestaurants(page = 1, search?: string) {
  const response = await api.get<RestaurantListResponse>("/restaurants", {
    params: { page, limit: 10, search: search || undefined },
  });

  return response.data;
}

export async function updateRestaurantStatus(
  restaurantId: number,
  status: "OPEN" | "CLOSED"
) {
  const response = await api.patch(`/restaurants/${restaurantId}`, {
    status,
  });

  return response.data;
}

export async function deleteRestaurant(restaurantId: number) {
  const response = await api.delete(`/restaurants/${restaurantId}`);
  return response.data;
}

export async function getUserById(userId: number) {
  const response = await api.get<AdminUserResponse>(`/admin/users/${userId}`);
  return response.data;
}

export async function createClient(data: CreateClientRequest) {
  const response = await api.post<AdminUserResponse>("/admin/users", data);
  return response.data;
}

export async function updateClient(
  userId: number,
  data: CreateClientRequest
) {
  const response = await api.patch<AdminUserResponse>(
    `/admin/users/${userId}`,
    data
  );
  return response.data;
}

export async function getRestaurantById(restaurantId: number) {
  const response = await api.get<RestaurantDetailResponse>(
    `/restaurants/${restaurantId}`
  );
  return response.data;
}

export async function createRestaurant(data: CreateRestaurantRequest) {
  const response = await api.post<RestaurantDetailResponse>(
    "/restaurants",
    data
  );
  return response.data;
}

export async function updateRestaurant(
  restaurantId: number,
  data: UpdateRestaurantRequest
) {
  const response = await api.patch<RestaurantDetailResponse>(
    `/restaurants/${restaurantId}`,
    data
  );
  return response.data;
}

export async function getCategoriesByRestaurant(restaurantId: number) {
  const response = await api.get<CategoryListResponse>("/categories", {
    params: { restaurantId },
  });
  return response.data;
}

export async function getCategoryById(categoryId: number) {
  const response = await api.get<CategoryDetailResponse>(
    `/categories/${categoryId}`
  );
  return response.data;
}

export async function createCategory(
  restaurantId: number,
  data: CreateCategoryRequest
) {
  const response = await api.post<CategoryDetailResponse>(
    `/categories/restaurant/${restaurantId}`,
    data
  );
  return response.data;
}

export async function updateCategory(
  categoryId: number,
  data: UpdateCategoryRequest
) {
  const response = await api.patch<CategoryDetailResponse>(
    `/categories/${categoryId}`,
    data
  );
  return response.data;
}

export async function deleteCategory(categoryId: number) {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
}

export async function getMenuItemsByRestaurant(restaurantId: number) {
  const response = await api.get<MenuItemListResponse>("/menu-items", {
    params: { restaurantId },
  });
  return response.data;
}

export async function getMenuItemById(menuItemId: number) {
  const response = await api.get<MenuItemDetailResponse>(
    `/menu-items/${menuItemId}`
  );
  return response.data;
}

export async function createMenuItem(
  categoryId: number,
  data: CreateMenuItemRequest
) {
  const response = await api.post<MenuItemDetailResponse>(
    `/menu-items/category/${categoryId}`,
    data
  );
  return response.data;
}

export async function updateMenuItem(
  menuItemId: number,
  data: UpdateMenuItemRequest
) {
  const response = await api.patch<MenuItemDetailResponse>(
    `/menu-items/${menuItemId}`,
    data
  );
  return response.data;
}

export async function deleteMenuItem(menuItemId: number) {
  const response = await api.delete(`/menu-items/${menuItemId}`);
  return response.data;
}