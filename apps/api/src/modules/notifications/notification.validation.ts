import type {
  CreateNotificationDto,
  UpdateNotificationDto
} from "./notification.types.js";

export function validateCreateNotification(
  data: CreateNotificationDto
) {
  const title = data.title?.trim();
  const message = data.message?.trim();

  if (!data.userId) {
    throw new Error("User id is required");
  }

  if (!data.type) {
    throw new Error("Notification type is required");
  }

  if (!title) {
    throw new Error("Title is required");
  }

  if (!message) {
    throw new Error("Message is required");
  }

  return {
    userId: data.userId,
    type: data.type,
    title,
    message,
    orderId: data.orderId,
    restaurantId: data.restaurantId,
    payload: data.payload,
  };
}

export function validateUpdateNotification(
  data: UpdateNotificationDto
) {
  return {
    isRead: Boolean(data.isRead),
  };
}