import { prisma } from "../../db/prisma.js";
import { UserRole } from "@prisma/client";
import { getIO } from "../../sockets/index.js";

import type { CreateOrderDto, UpdateOrderStatusDto } from "./order.types.js";
import { validateCreateOrder, validateUpdateOrderStatus } from "./order.validation.js";

export async function createOrder(
  userId: number,
  data: CreateOrderDto
) {
  const validatedData = validateCreateOrder(data);

  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (!cart.restaurantId) {
    throw new Error("Cart is empty");
  }

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (sum, item) =>
      sum +
      Number(item.priceSnapshot) * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      restaurantId: cart.restaurantId,
      totalPrice,

      deliveryAddress: validatedData.deliveryAddress,

      ...(validatedData.customerNote !== undefined && {
        customerNote: validatedData.customerNote,
      }),

      ...(validatedData.customerPhone !== undefined && {
        customerPhone: validatedData.customerPhone,
      }),

      ...(validatedData.paymentMethod !== undefined && {
        paymentMethod: validatedData.paymentMethod,
      }),

      items: {
        create: cart.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.priceSnapshot,
          itemName: item.menuItem.name,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      restaurantId: null,
    },
  });

  return order;
}

export async function getMyOrders(userId: number) {
  return prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      restaurant: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getRestaurantOrders(
  restaurantId: number,
  currentUserId: number,
  currentUserRole: UserRole
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN ||
    restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  return prisma.order.findMany({
    where: { restaurantId },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(
  orderId: number,
  userId: number
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      restaurant: true,
      items: true,
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

export async function updateOrderStatus(
  orderId: number,
  currentUserId: number,
  currentUserRole: UserRole,
  data: UpdateOrderStatusDto
) {
  const validatedData =
    validateUpdateOrderStatus(data);

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      restaurant: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const canManage =
    currentUserRole === UserRole.ADMIN ||
    order.restaurant.ownerId === currentUserId;

  if (!canManage) {
    throw new Error("Forbidden");
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: validatedData.status,
      statusUpdatedAt: new Date(),
    },
  });

  getIO().to(`user:${order.userId}`).emit("order:status", {
    orderId: updatedOrder.id,
    status: updatedOrder.status,
  });

  return updatedOrder;
}

export async function cancelOrder(
  orderId: number,
  userId: number
) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId !== userId) {
    throw new Error("Forbidden");
  }

  if (order.status !== "PENDING") {
    throw new Error(
      "Only pending orders can be cancelled"
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
}