import api from "../../../lib/api";
import type { NotificationListResponse } from "../types/notification.types";

export async function getMyNotifications() {
  const response = await api.get<NotificationListResponse>("/notifications");

  return response.data;
}

export async function markNotificationAsRead(notificationId: number) {
  const response = await api.patch(`/notifications/${notificationId}/read`);

  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch("/notifications/read-all");

  return response.data;
}

export async function deleteNotification(notificationId: number) {
  const response = await api.delete(`/notifications/${notificationId}`);

  return response.data;
}
