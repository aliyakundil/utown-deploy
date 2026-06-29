import type {
  PaymentMethod,
  StatusOrders,
} from "@prisma/client";

export interface CreateOrderDto {
  deliveryAddress?: string;
  customerNote?: string;
  customerPhone?: string;
  paymentMethod?: PaymentMethod;
}

export interface UpdateOrderStatusDto {
  status: StatusOrders;
}