import { prisma } from "../../db/prisma.js";

import type {
  CreatePaymentDto
} from "./payment.types.js";

import {
  validateCreatePayment
} from "./payment.validation.js";

export async function createPayment(
  orderId: number,
  userId: number,
  data: CreatePaymentDto
) {
  const validatedData = validateCreatePayment(data);

  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "CANCELLED") {
    throw new Error("Cancelled order cannot be paid");
  }

  if (order.paymentStatus === "PAID") {
    throw new Error("Order has already been paid");
  }

  if (order.userId !== userId) {
    throw new Error("Forbidden");
  }

  return prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: "PENDING",
    },
  });
}

export async function getPayment(
  orderId: number,
  userId: number
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      userId: true,
      paymentMethod: true,
      paymentStatus: true,
      totalPrice: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId !== userId) {
    throw new Error("Forbidden");
  }

  return order;
}