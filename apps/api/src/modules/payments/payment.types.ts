import {
  PaymentMethod
} from "@prisma/client";

export interface CreatePaymentDto {
  paymentMethod: PaymentMethod;
}