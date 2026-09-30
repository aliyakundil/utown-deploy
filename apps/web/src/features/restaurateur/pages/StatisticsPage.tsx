import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StatisticsPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { getMyProfile } from "../../profile/api/profile.api";
import { getMyRestaurants, getRestaurantOrders } from "../api/restaurateur.api";
import type { MyRestaurant, RestaurantOrder } from "../types/restaurateur.types";
import type { OrderStatus } from "../../orders/types/order.types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Order received",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY: "Ready for delivery",
  COMPLETED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

type LoadState = "loading" | "forbidden" | "no-restaurant" | "ready";

export default function StatisticsPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();

  const [state, setState] = useState<LoadState>("loading");
  const [restaurant, setRestaurant] = useState<MyRestaurant | null>(null);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);

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

          return getRestaurantOrders(first.id).then((ordersRes) => {
            setOrders(ordersRes.data);
            setState("ready");
          });
        });
      })
      .catch(() => setState("forbidden"));
  }, []);

  if (state === "forbidden") {
    return (
      <>
        <BusinessSidebar />
        <main className="stats-page">
          <p className="stats-message">
            This page is only available to restaurant owners.
          </p>
          <button
            type="button"
            className="stats-home-button"
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
        <main className="stats-page">
          <p className="stats-message">You don't have a restaurant yet.</p>
        </main>
      </>
    );
  }

  const totalOrders = orders.length;

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.totalPrice), 0);

  const activeOrders = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
  ).length;

  const countByStatus = STATUS_ORDER.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  return (
    <>
      <BusinessSidebar />

      <main className="stats-page">
        <header className="stats-header">
          <button
            type="button"
            className="stats-hamburger"
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

          <h1 className="stats-title">
            {restaurant ? restaurant.name : "Statistics"}
          </h1>
        </header>

        {state === "loading" && <p className="stats-message">Loading...</p>}

        <div className="stats-body">
          <div className="stats-tiles">
            <div className="stats-tile">
              <p className="stats-tile__value">{totalOrders}</p>
              <p className="stats-tile__label">Total orders</p>
            </div>

            <div className="stats-tile">
              <p className="stats-tile__value">{revenue} som</p>
              <p className="stats-tile__label">Revenue</p>
            </div>

            <div className="stats-tile">
              <p className="stats-tile__value">{activeOrders}</p>
              <p className="stats-tile__label">Active orders</p>
            </div>
          </div>

          <h2 className="stats-subtitle">Orders by status</h2>

          <div className="stats-breakdown">
            {countByStatus.map(({ status, count }) => (
              <div key={status} className="stats-breakdown__row">
                <span className="stats-breakdown__label">
                  {STATUS_LABELS[status]}
                </span>
                <span className="stats-breakdown__count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
