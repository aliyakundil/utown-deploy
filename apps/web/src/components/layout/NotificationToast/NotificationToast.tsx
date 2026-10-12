import { useEffect, useState } from "react";

import "./NotificationToast.css";

import type { OrderStatusEvent, OrderNewEvent } from "../../../lib/socket";

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

  useEffect(() => {
    function handleOrderStatus(e: Event) {
      const { detail } = e as CustomEvent<OrderStatusEvent>;
      const label = STATUS_LABELS[detail.status] ?? detail.status;

      setMessage(`Order #${detail.orderId}: ${label}`);

      window.setTimeout(() => setMessage(null), 5000);
    }

    function handleOrderNew(e: Event) {
      const { detail } = e as CustomEvent<OrderNewEvent>;

      setMessage(`New order #${detail.orderId} received`);

      window.setTimeout(() => setMessage(null), 5000);
    }

    window.addEventListener("order:status", handleOrderStatus);
    window.addEventListener("order:new", handleOrderNew);

    return () => {
      window.removeEventListener("order:status", handleOrderStatus);
      window.removeEventListener("order:new", handleOrderNew);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="notification-toast" role="status">
      {message}
    </div>
  );
}