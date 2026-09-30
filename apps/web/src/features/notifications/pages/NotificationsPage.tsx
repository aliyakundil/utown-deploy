import { useEffect, useState } from "react";

import "../../profile/pages/ProfileSubpage.css";

import BackButton from "../../../components/ui/BackButton/BackButton";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../api/notification.api";
import type { AppNotification } from "../types/notification.types";

import Logo from "../../../assets/images/Vector.svg";

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setIsLoading(false));
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
      // ignore — the row already reflects "read" state locally
    }
  };

  let lastGroup = "";

  return (
    <main className="profile-sub-page">
      <header className="profile-sub-header">
        <BackButton to="/profile" />

        <div className="profile-sub-header__logo">
          <img src={Logo} alt="UTOWN" />
        </div>
      </header>

      <h1 className="profile-sub-title">Notifications</h1>

      <div className="profile-sub-content">
        {isLoading && <p className="profile-sub-empty">Loading...</p>}

        {!isLoading && notifications.length === 0 && (
          <p className="profile-sub-empty">No notifications yet.</p>
        )}

        {notifications.map((notification) => {
          const group = groupLabel(notification.createdAt);
          const showGroupLabel = group !== lastGroup;
          lastGroup = group;

          return (
            <div key={notification.id}>
              {showGroupLabel && (
                <p className="notification-group-label">{group}</p>
              )}

              <button
                type="button"
                className={`notification-card ${
                  !notification.isRead ? "notification-card--unread" : ""
                }`}
                onClick={() => handleOpen(notification)}
                style={{
                  display: "block",
                  width: "100%",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "inherit",
                  font: "inherit",
                }}
              >
                <p className="notification-card__message">
                  {notification.title}: {notification.message}
                </p>
                <span className="notification-card__time">
                  {formatTime(notification.createdAt)}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
