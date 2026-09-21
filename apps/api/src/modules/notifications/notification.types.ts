import { NotificationType, Prisma } from "@prisma/client"

export interface CreateNotificationDto {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: number;
  restaurantId?: number;
  payload?: Prisma.InputJsonValue;
}

export interface UpdateNotificationDto {
  isRead: boolean;
}