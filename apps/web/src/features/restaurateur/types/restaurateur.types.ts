import type { Category, MenuItem } from "../../restaurants/types/restaurant.types";
import type { OrderItem, OrderStatus } from "../../orders/types/order.types";

export interface MyRestaurant {
  id: number;
  ownerId: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  status: "OPEN" | "CLOSED";
  imageUrl: string | null;
  minimumOrder: string | null;
  categories: Category[];
  menuItems: MenuItem[];
}

export interface MyRestaurantsResponse {
  success: boolean;
  data: MyRestaurant[];
}

export interface RestaurantOrderCustomer {
  id: number;
  name: string;
  phone: string;
}

export interface RestaurantOrder {
  id: number;
  userId: number;
  restaurantId: number;
  status: OrderStatus;
  totalPrice: string;
  deliveryAddress: string | null;
  customerNote: string | null;
  customerPhone: string | null;
  paymentMethod: "CASH" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  items: OrderItem[];
  user: RestaurantOrderCustomer;
}

export interface RestaurantOrdersResponse {
  success: boolean;
  data: RestaurantOrder[];
}

export interface CreateCategoryRequest {
  name: string;
  priority?: number;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CreateMenuItemRequest {
  name: string;
  price: number;
  description?: string;
}

export interface UpdateMenuItemRequest {
  name?: string;
  price?: number;
  description?: string;
  isAvailable?: boolean;
}

export interface MenuItemResponse {
  success: boolean;
  data: MenuItem;
}

export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
  minimumOrder?: number;
}

export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  status?: "OPEN" | "CLOSED";
  imageUrl?: string;
  minimumOrder?: number;
}


export interface MyRestaurantResponse {
  success: boolean;
  data: MyRestaurant;
}
