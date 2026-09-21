import type {
  CreatePaymentDto
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