import type { Restaurant } from "../../restaurants/types/restaurant.types";

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price: string;
  itemName: string;
}

export interface Order {
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
  restaurant: Restaurant;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  customerNote?: string;
  customerPhone?: string;
  paymentMethod?: "CASH" | "CARD";
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface OrdersListResponse {
  success: boolean;
  data: Order[];
}
