import { prisma } from "../../db/prisma.js";
import type { CreateNotificationDto } from "./notification.types.js";
import { validateCreateNotification } from "./notification.validation.js";

export async function createNotification(
  data: CreateNotificationDto
) {
  const validatedData = validateCreateNotification(data);

  return prisma.notification.create({
    data: {
      userId: validatedData.userId,
      type: validatedData.type,
      title: validatedData.title,
      message: validatedData.message,

      ...(validatedData.orderId !== undefined && {
        orderId: validatedData.orderId,
      }),

      ...(validatedData.restaurantId !== undefined && {
        restaurantId: validatedData.restaurantId,
      }),

      ...(validatedData.payload !== undefined && {
        payload: validatedData.payload,
      }),
    },
  });
}

export async function getNotifications(userId: number) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function markAsRead(
  userId: number,
  notificationId: number
) {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

export async function markAllAsRead(userId: number) {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return {
    success: true,
  };
}

export async function deleteNotification(
  userId: number,
  notificationId: number
) {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  await prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });

  return {
    success: true,
  };
}