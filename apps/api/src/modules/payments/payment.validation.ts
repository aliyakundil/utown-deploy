import type {
  CreatePaymentDto,
  UpdatePaymentDto,
} from "./payment.types.js";

export function validateCreatePayment(
  data: CreatePaymentDto
) {
  if (!data.paymentMethod) {
    throw new Error("Payment method is required");
  }

  return {
    paymentMethod: data.paymentMethod,
  };
}

export function validateUpdatePayment(
  data: UpdatePaymentDto
) {
  if (!data.paymentStatus) {
    throw new Error("Payment status is required");
  }

  return {
    paymentStatus: data.paymentStatus,
  };
}