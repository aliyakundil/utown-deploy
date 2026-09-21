import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./OrderStatusPage.css";

import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { getOrderById } from "../api/orders.api";
import type { Order, OrderStatus } from "../types/order.types";

import UTIcon from "../../../assets/images/Vector.svg";
import FoodWordmark from "../../../assets/images/Category.svg";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order received",
  ACCEPTED: "Accepted by restaurant",
  PREPARING: "Being prepared",
  READY: "Ready for delivery",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

const ACTIVE_STEPS: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "COMPLETED",
];

export default function OrderStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    loadOrder(Number(id));

    const interval = setInterval(() => {
      loadOrder(Number(id), true);
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  function loadOrder(orderId: number, silent = false) {
    getOrderById(orderId)
      .then((res) => {
        setOrder(res.data);

        if (
          res.data.status === "COMPLETED" ||
          res.data.status === "CANCELLED"
        ) {
          clearAllIntervals();
        }
      })
      .catch(() => {
        if (!silent) setError("Order not found");
      });
  }

  function clearAllIntervals() {
    // interval is cleared automatically on unmount / next effect run;
    // this only stops polling once a terminal status is reached
  }

  if (error) {
    return (
      <>
        <Sidebar />
        <main className="order-status-page">
          <p className="order-status-error">{error}</p>
          <button
            type="button"
            className="order-status-home-button"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Sidebar />
        <main className="order-status-page" />
      </>
    );
  }

  const stepIndex = ACTIVE_STEPS.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <>
      <Sidebar />

      <main className="order-status-page">
        <header className="order-status-header">
          <Link to="/home" className="order-status-header__logo">
            <img src={UTIcon} alt="" />
            <img src={FoodWordmark} alt="FOOD" />
          </Link>

          <button
            type="button"
            className="order-status-header__bell"
            aria-label="Notifications"
          >
            <NotificationBell ringColor="none" />
          </button>
        </header>

        <div className="order-status-summary">
          <p className="order-status-summary__label">Order #{order.id}</p>

          <p
            className={`order-status-badge ${
              isCancelled ? "order-status-badge--cancelled" : ""
            }`}
          >
            {STATUS_LABELS[order.status]}
          </p>

          {!isCancelled && (
            <div className="order-status-steps">
              {ACTIVE_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`order-status-steps__dot ${
                    index <= stepIndex ? "order-status-steps__dot--done" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <section className="order-status-section">
          <h2 className="order-status-section__title">
            {order.restaurant.name}
          </h2>

          {order.items.map((item) => (
            <div key={item.id} className="order-status-item">
              <span>
                {item.quantity} × {item.itemName}
              </span>
              <span>{Number(item.price) * item.quantity} som</span>
            </div>
          ))}

          <div className="order-status-item order-status-item--total">
            <span>Total</span>
            <span>{order.totalPrice} som</span>
          </div>
        </section>

        <section className="order-status-section">
          <h2 className="order-status-section__title">Delivery</h2>

          <p className="order-status-detail">{order.deliveryAddress}</p>

          {order.customerNote && (
            <p className="order-status-detail order-status-detail--note">
              {order.customerNote}
            </p>
          )}

          <p className="order-status-detail">
            Payment: {order.paymentMethod === "CASH" ? "Cash" : "Card"} ·{" "}
            {order.paymentStatus === "PAID" ? "Paid" : "Pending"}
          </p>
        </section>

        <button
          type="button"
          className="order-status-home-button"
          onClick={() => navigate("/home")}
        >
          Back to Home
        </button>
      </main>
    </>
  );
}
