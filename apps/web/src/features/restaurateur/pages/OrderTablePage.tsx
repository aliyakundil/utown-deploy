import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./OrderTablePage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { getMyProfile } from "../../profile/api/profile.api";
import { getMyRestaurants, getRestaurantOrders } from "../api/restaurateur.api";
import { updateOrderStatus } from "../../orders/api/orders.api";
import type { MyRestaurant, RestaurantOrder } from "../types/restaurateur.types";
import type { OrderStatus } from "../../orders/types/order.types";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

type LoadState = "loading" | "forbidden" | "no-restaurant" | "ready";

export default function OrderTablePage() {
  const navigate = useNavigate();
  const { open } = useSidebar();

  const [state, setState] = useState<LoadState>("loading");
  const [restaurant, setRestaurant] = useState<MyRestaurant | null>(null);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "RESTAURATEUR" && res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return getMyRestaurants().then((restaurantsRes) => {
          const first = restaurantsRes.data[0];

          if (!first) {
            setState("no-restaurant");
            return;
          }

          setRestaurant(first);
          return loadOrders(first.id);
        });
      })
      .catch(() => setState("forbidden"));
  }, []);

  function loadOrders(restaurantId: number) {
    return getRestaurantOrders(restaurantId)
      .then((res) => {
        setOrders(res.data);
        setState("ready");
      })
      .catch(() => setState("forbidden"));
  }

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    setError("");

    try {
      await updateOrderStatus(orderId, status);
      if (restaurant) await loadOrders(restaurant.id);
    } catch {
      setError("Couldn't update order status");
    }
  };

  if (state === "forbidden") {
    return (
      <>
        <BusinessSidebar />
        <main className="order-table-page">
          <p className="order-table-message">
            This page is only available to restaurant owners.
          </p>
          <button
            type="button"
            className="order-table-home-button"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </main>
      </>
    );
  }

  if (state === "no-restaurant") {
    return (
      <>
        <BusinessSidebar />
        <main className="order-table-page">
          <p className="order-table-message">
            You don't have a restaurant yet.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <BusinessSidebar />

      <main className="order-table-page">
        <header className="order-table-header">
          <button
            type="button"
            className="order-table-hamburger"
            aria-label="Open menu"
            onClick={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h1 className="order-table-title">
            {restaurant ? restaurant.name : "Order table"}
          </h1>
        </header>

        {error && <p className="order-table-error">{error}</p>}

        {state === "loading" && (
          <p className="order-table-message">Loading...</p>
        )}

        {state === "ready" && orders.length === 0 && (
          <p className="order-table-message">No orders yet.</p>
        )}

        <div className="order-table-list">
          {orders.map((order) => (
            <div key={order.id} className="order-row">
              <div className="order-row__top">
                <span className="order-row__id">Order #{order.id}</span>
                <span className="order-row__time">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="order-row__customer">
                {order.user.name} · {order.user.phone}
              </p>

              <p className="order-row__items">
                {order.items
                  .map((item) => `${item.quantity} × ${item.itemName}`)
                  .join(", ")}
              </p>

              <p className="order-row__address">{order.deliveryAddress}</p>

              <div className="order-row__bottom">
                <span className="order-row__total">
                  {order.totalPrice} som
                </span>

                <select
                  className="order-row__status"
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value as OrderStatus
                    )
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
