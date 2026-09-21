import type { MenuItem } from "../../restaurants/types/restaurant.types";

export interface CartItem {
  id: number;
  cartId: number;
  menuItemId: number;
  quantity: number;
  priceSnapshot: string;
  menuItem: MenuItem;
}

export interface Cart {
  id: number;
  userId: number;
  restaurantId: number | null;
  items: CartItem[];
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

export interface CartItemResponse {
  success: boolean;
  data: CartItem;
}
