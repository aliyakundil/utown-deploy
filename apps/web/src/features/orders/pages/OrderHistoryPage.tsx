import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./OrderHistoryPage.css";

import BackButton from "../../../components/ui/BackButton/BackButton.tsx";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { getMyOrders } from "../api/orders.api";
import type { Order, OrderStatus } from "../types/order.types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order received",
  ACCEPTED: "Accepted by restaurant",
  PREPARING: "Being prepared",
  READY: "Ready for delivery",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Sidebar />

      <main className="order-history-page">
        <header className="order-history-header">
          <BackButton to="/profile" />
          <h1 className="order-history-title">My Orders</h1>
        </header>

        <div className="order-history-list">
          {isLoading && <p className="order-history-empty">Loading...</p>}

          {!isLoading && orders.length === 0 && (
            <div className="order-history-empty">
              <p>You have no orders yet</p>
              <Link to="/restaurants">Browse restaurants</Link>
            </div>
          )}

          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="order-history-card"
            >
              <div className="order-history-card__top">
                <span className="order-history-card__restaurant">
                  {order.restaurant.name}
                </span>
                <span
                  className={`order-history-card__status ${
                    order.status === "CANCELLED"
                      ? "order-history-card__status--cancelled"
                      : ""
                  }`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <p className="order-history-card__items">
                {order.items.map((item) => item.itemName).join(", ")}
              </p>

              <div className="order-history-card__bottom">
                <span>Order #{order.id}</span>
                <span>{order.totalPrice} som</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
