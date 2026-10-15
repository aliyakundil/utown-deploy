import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./OrderStatusPage.css";

import BackButton from "../../../components/ui/BackButton/BackButton";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import api from "../../../lib/api";
import { getOrderById } from "../api/orders.api";
import type { Order, OrderStatus } from "../types/order.types";

import UTIcon from "../../../assets/images/Vector.svg";
import FoodWordmark from "../../../assets/images/Category.svg";
import PreparingImage from "../../../assets/images/Prepating.svg";
import DeliveringImage from "../../../assets/images/Delivering.svg";
import DeliveredImage from "../../../assets/images/Delivered.svg";

const STATUS_ILLUSTRATIONS: Partial<Record<OrderStatus, string>> = {
  ACCEPTED: PreparingImage,
  PREPARING: PreparingImage,
  READY: DeliveringImage,
  COMPLETED: DeliveredImage,
};

const STATUS_HEADLINES: Record<OrderStatus, string> = {
  PENDING: "Order received",
  ACCEPTED: "Order confirmed by the restaurant",
  PREPARING: "Your order is being prepared",
  READY: "The courier is on the way",
  COMPLETED: "Order delivered",
  CANCELLED: "Order cancelled",
};

const STATUS_SUBTEXT: Record<OrderStatus, string> = {
  PENDING: "Waiting for the restaurant to confirm your order.",
  ACCEPTED: "The restaurant has confirmed your order!",
  PREPARING: "The restaurant is preparing your order.",
  READY: "Your order is on its way to you.",
  COMPLETED: "Your order has been delivered. Enjoy!",
  CANCELLED: "This order was declined by the restaurant.",
};

export default function OrderStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [showRating, setShowRating] = useState(false);

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
      .then((res) => setOrder(res.data))
      .catch(() => {
        if (!silent) setError("Order not found");
      });
  }

  const handleRate = async (stars: number) => {
    setRatingValue(stars);
    setRatingError("");

    if (!order) return;

    try {
      await api.post(`/ratings/restaurant/${order.restaurantId}`, {
        rating: stars,
      });
      setRatingSubmitted(true);
      return;
    } catch (err) {
      const alreadyRated =
        axios.isAxiosError(err) &&
        err.response?.data?.error === "You have already rated this restaurant";

      if (!alreadyRated) {
        setRatingError("Couldn't submit your rating");
        return;
      }
    }

    try {
      await api.patch(`/ratings/restaurant/${order.restaurantId}`, {
        rating: stars,
      });
      setRatingSubmitted(true);
    } catch {
      setRatingError("Couldn't submit your rating");
    }
  };

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

  const isCancelled = order.status === "CANCELLED";
  const isDelivered = order.status === "COMPLETED";
  const illustration = STATUS_ILLUSTRATIONS[order.status];

  if (isDelivered && showRating) {
    return (
      <>
        <Sidebar />
        <main className="order-status-page">
          <header className="order-status-header">
            <BackButton to="/home" />
            <span className="order-status-header__logo">
              <img src={UTIcon} alt="" />
              <img src={FoodWordmark} alt="FOOD" />
            </span>
            <button
              type="button"
              className="order-status-header__bell"
              aria-label="Notifications"
            >
              <NotificationBell ringColor="none" />
            </button>
          </header>

          <div className="order-delivered">
            <h1 className="order-delivered__title">Order delivered!</h1>
            <p className="order-delivered__subtitle">
              {ratingSubmitted ? "Thanks for your feedback!" : "Please rate the service"}
            </p>

            {!ratingSubmitted && (
              <>
                <p className="order-delivered__label">{order.restaurant.name}</p>

                <div className="order-delivered__stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`order-delivered__star ${
                        star <= ratingValue ? "order-delivered__star--filled" : ""
                      }`}
                      onClick={() => handleRate(star)}
                      aria-label={`Rate ${star} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {ratingError && <p className="order-status-error">{ratingError}</p>}
              </>
            )}
          </div>

          <button
            type="button"
            className="order-status-home-button"
            onClick={() => navigate("/home")}
          >
            Ready
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <main className="order-status-page">
        <header className="order-status-header">
          <BackButton to="/home" />
          <span className="order-status-header__logo">
            <img src={UTIcon} alt="" />
            <img src={FoodWordmark} alt="FOOD" />
          </span>
          <button
            type="button"
            className="order-status-header__bell"
            aria-label="Notifications"
          >
            <NotificationBell ringColor="none" />
          </button>
        </header>

        <div
          className={`order-status-illustration ${
            !illustration ? "order-status-illustration--empty" : ""
          }`}
        >
          {illustration && <img src={illustration} alt="" />}
        </div>

        <div className="order-status-card">
          {!isCancelled && !isDelivered && (
            <div className="order-status-eta">
              <p className="order-status-eta__value">40–60</p>
              <p className="order-status-eta__caption">minutes until delivery</p>
            </div>
          )}

          <p className="order-status-summary__label">{order.restaurant.name}</p>

          <p
            className={`order-status-badge ${
              isCancelled ? "order-status-badge--cancelled" : ""
            }`}
          >
            {STATUS_HEADLINES[order.status]}
          </p>

          {STATUS_SUBTEXT[order.status] && (
            <p className="order-status-subtext">{STATUS_SUBTEXT[order.status]}</p>
          )}

          {!isCancelled && (
            <Link to="/profile/contact-support" className="order-status-support">
              Contact support
            </Link>
          )}

          <button
            type="button"
            className="order-status-home-button"
            onClick={() =>
              isDelivered ? setShowRating(true) : navigate("/home")
            }
          >
            Hide order status
          </button>
        </div>

        <section className="order-status-section">
          <h2 className="order-status-section__title">Order #{order.id}</h2>

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
      </main>
    </>
  );
}
