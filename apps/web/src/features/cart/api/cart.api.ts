import api from "../../../lib/api";
import type { CartResponse, CartItemResponse } from "../types/cart.types";

export async function getCart() {
  const response = await api.get<CartResponse>("/cart");
  return response.data;
}

export async function addCartItem(menuItemId: number, quantity: number) {
  const response = await api.post<CartItemResponse>("/cart/items", {
    menuItemId,
    quantity,
  });
  return response.data;
}

export async function updateCartItem(itemId: number, quantity: number) {
  const response = await api.patch<CartItemResponse>(
    `/cart/items/${itemId}`,
    { quantity }
  );
  return response.data;
}

export async function removeCartItem(itemId: number) {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data;
}

export async function clearCart() {
  const response = await api.delete("/cart");
  return response.data;
}
