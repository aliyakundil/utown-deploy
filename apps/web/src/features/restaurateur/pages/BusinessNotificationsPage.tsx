import { useEffect, useState } from "react";

import "./BusinessNotificationsPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../../notifications/api/notification.api";
import type { AppNotification } from "../../notifications/types/notification.types";
import type { OrderNewEvent } from "../../../lib/socket";

function groupLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString();
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BusinessNotificationsPage() {
  const { open } = useSidebar();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    getMyNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();

    const handleNewOrder = (e: Event) => {
      void (e as CustomEvent<OrderNewEvent>);
      load();
    };

    window.addEventListener("order:new", handleNewOrder);
    return () => window.removeEventListener("order:new", handleNewOrder);
  }, []);

  const handleOpen = async (notification: AppNotification) => {
    if (notification.isRead) return;

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    try {
      await markNotificationAsRead(notification.id);
    } catch {
      // 
    }
  };

  const groupedNotifications = notifications.reduce<
    { notification: AppNotification; group: string; showGroup: boolean }[]
  >((acc, notification) => {
    const group = groupLabel(notification.createdAt);
    const prevGroup = acc[acc.length - 1]?.group;

    acc.push({ notification, group, showGroup: group !== prevGroup });

    return acc;
  }, []);

  return (
    <>
      <BusinessSidebar />

      <main className="business-notifications-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="business-notifications-title">Notifications</h1>

        {isLoading && (
          <p className="business-notifications-message">Loading...</p>
        )}

        {!isLoading && notifications.length === 0 && (
          <p className="business-notifications-message">
            No notifications yet.
          </p>
        )}

        <div className="business-notifications-list">
          {groupedNotifications.map(({ notification, group, showGroup }) => (
            <div key={notification.id}>
              {showGroup && (
                <p className="business-notifications-group">{group}</p>
              )}

              <button
                type="button"
                className={`business-notification-card ${
                  !notification.isRead
                    ? "business-notification-card--unread"
                    : ""
                }`}
                onClick={() => handleOpen(notification)}
              >
                <p className="business-notification-card__message">
                  {notification.title}: {notification.message}
                </p>
                <span className="business-notification-card__time">
                  {formatTime(notification.createdAt)}
                </span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}