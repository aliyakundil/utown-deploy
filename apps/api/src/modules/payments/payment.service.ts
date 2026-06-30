import { prisma } from "../../db/prisma.js";

import type {
  CreatePaymentDto,
  UpdatePaymentDto,
} from "./payment.types.js";

import {
  validateCreatePayment,
  validateUpdatePayment,
} from "./payment.validation.js";

export async function createPayment(
  orderId: number,
  data: CreatePaymentDto
) {
  const validatedData = validateCreatePayment(data);

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
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

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: "PENDING",
    },
  });
}

export async function getPayment(
  orderId: number
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      paymentMethod: true,
      paymentStatus: true,
      totalPrice: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}

export async function updatePayment(
  orderId: number,
  data: UpdatePaymentDto
) {
  const validatedData = validateUpdatePayment(data);

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
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

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus: validatedData.paymentStatus,
    },
  });
}