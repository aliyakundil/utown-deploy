import type {
  AddToCartDto,
  UpdateCartItemDto,
} from "./cart.types.js";

export function validateAddToCart(
  data: AddToCartDto
) {
  if (!data.menuItemId) {
    throw new Error("Menu item id is required");
  }

  if (!data.quantity) {
    throw new Error("Quantity is required");
  }

  if (data.quantity <= 0) {
    throw new Error(
      "Quantity must be greater than 0"
    );
  }

  return {
    menuItemId: Number(data.menuItemId),
    quantity: Number(data.quantity),
  };
}

export function validateUpdateCartItem(
  data: UpdateCartItemDto
) {
  if (!data.quantity) {
    throw new Error("Quantity is required");
  }

  if (data.quantity <= 0) {
    throw new Error(
      "Quantity must be greater than 0"
    );
  }

  return {
    quantity: Number(data.quantity),
  };
}