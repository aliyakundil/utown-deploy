import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StatisticsPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { getRestaurantOrders } from "../api/restaurateur.api";
import type { RestaurantOrder } from "../types/restaurateur.types";
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

export default function StatisticsPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant } = useMyRestaurant();

  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    if (!restaurant) return;

    getRestaurantOrders(restaurant.id).then((ordersRes) => {
      setOrders(ordersRes.data);
      setOrdersLoaded(true);
    });
  }, [restaurant]);

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <>
        <BusinessSidebar />
        <main className="stats-page">
          <p className="stats-message">Loading...</p>
        </main>
      </>
    );
  }

  if (restaurantState === "forbidden") {
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

  if (!restaurant) {
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
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="stats-title">{restaurant.name}</h1>

        {!ordersLoaded && <p className="stats-message">Loading...</p>}

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