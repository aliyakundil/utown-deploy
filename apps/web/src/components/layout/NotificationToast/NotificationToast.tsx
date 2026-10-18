import { useEffect, useRef, useState } from "react";

import "./NotificationToast.css";

import type { OrderStatusEvent, OrderNewEvent, SystemNotificationEvent } from "../../../lib/socket";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order received",
  ACCEPTED: "Accepted by restaurant",
  PREPARING: "Being prepared",
  READY: "Ready for delivery",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function NotificationToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function showMessage(text: string) {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      setMessage(text);
      timeoutRef.current = window.setTimeout(() => {
        setMessage(null);
        timeoutRef.current = null;
      }, 5000);
    }

    function handleOrderStatus(e: Event) {
      const { detail } = e as CustomEvent<OrderStatusEvent>;
      const label = STATUS_LABELS[detail.status] ?? detail.status;

      showMessage(`Order #${detail.orderId}: ${label}`);
    }

    function handleOrderNew(e: Event) {
      const { detail } = e as CustomEvent<OrderNewEvent>;

      showMessage(`New order #${detail.orderId} received`);
    }

    function handleSystemNotification(e: Event) {
      const { detail } = e as CustomEvent<SystemNotificationEvent>;

      showMessage(`${detail.title}: ${detail.message}`);
    }

    window.addEventListener("order:status", handleOrderStatus);
    window.addEventListener("order:new", handleOrderNew);
    window.addEventListener("notification:system", handleSystemNotification);

    return () => {
      window.removeEventListener("order:status", handleOrderStatus);
      window.removeEventListener("order:new", handleOrderNew);
      window.removeEventListener("notification:system", handleSystemNotification);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!message) return null;

  return (
    <div className="notification-toast" role="status">
      {message}
    </div>
  );
}