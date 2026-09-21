import api from "../../../lib/api";
import type {
  OrderResponse,
  OrdersListResponse,
  CreateOrderRequest,
  OrderStatus,
} from "../types/order.types";

export async function createOrder(data: CreateOrderRequest) {
  const response = await api.post<OrderResponse>("/orders", data);
  return response.data;
}

export async function getOrderById(id: number) {
  const response = await api.get<OrderResponse>(`/orders/${id}`);
  return response.data;
}

export async function getMyOrders() {
  const response = await api.get<OrdersListResponse>("/orders");
  return response.data;
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const response = await api.patch<OrderResponse>(`/orders/${id}/status`, {
    status,
  });
  return response.data;
}
