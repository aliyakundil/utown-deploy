export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  data: AppNotification[];
}
