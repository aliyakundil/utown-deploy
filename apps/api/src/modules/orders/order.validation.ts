import type { CreateOrderDto, UpdateOrderStatusDto } from "./order.types.js";

const phoneRegex = /^\+?[0-9]{10,15}$/;

export function validateCreateOrder(
  data: CreateOrderDto
) {
  const deliveryAddress =
    data.deliveryAddress?.trim();

  const customerNote =
    data.customerNote?.trim();

  const customerPhone =
    data.customerPhone?.trim();

  const paymentMethod =
    data.paymentMethod;

  if (!deliveryAddress) {
    throw new Error(
      "Delivery address is required"
    );
  }

  if (
    customerPhone &&
    !phoneRegex.test(customerPhone)
  ) {
    throw new Error(
      "Invalid customer phone number format"
    );
  }

  return {
    deliveryAddress,
    customerNote,
    customerPhone,
    paymentMethod,
  };
}

export function validateUpdateOrderStatus(
  data: UpdateOrderStatusDto
) {
  if (!data.status) {
    throw new Error("Status is required");
  }

  return {
    status: data.status,
  };
}