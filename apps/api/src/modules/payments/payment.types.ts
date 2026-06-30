import {
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

export interface CreatePaymentDto {
  paymentMethod: PaymentMethod;
}

export interface UpdatePaymentDto {
  paymentStatus: PaymentStatus;
}