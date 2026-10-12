import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./OrderTablePage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { getRestaurantOrders } from "../api/restaurateur.api";
import { updateOrderStatus } from "../../orders/api/orders.api";
import type { RestaurantOrder } from "../types/restaurateur.types";

const ACTIVE_STATUSES = ["PENDING", "ACCEPTED", "PREPARING", "READY"];
const COMPLETED_STATUSES = ["COMPLETED", "CANCELLED"];

const REJECT_REASONS = [
  "Restaurant is closed",
  "Missing ingredients",
  "Too busy right now",
  "Client unreachable",
];

type Tab = "active" | "completed";

export default function OrderTablePage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant } = useMyRestaurant();

  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("active");
  const [error, setError] = useState("");

  const [rejectingOrderId, setRejectingOrderId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [confirmingAcceptId, setConfirmingAcceptId] = useState<number | null>(null);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [cookingMinutes, setCookingMinutes] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!restaurant) return;
    loadOrders(restaurant.id);
  }, [restaurant]);

  function loadOrders(restaurantId: number) {
    return getRestaurantOrders(restaurantId)
      .then((res) => {
        setOrders(res.data);
        setOrdersLoaded(true);
      })
      .catch(() => {});
  }

  const refresh = () => {
    if (restaurant) return loadOrders(restaurant.id);
  };

  const handleAccept = async (orderId: number) => {
    setError("");
    try {
      await updateOrderStatus(orderId, "ACCEPTED");
      await refresh();
    } catch {
      setError("Couldn't accept the order");
    }
  };

  const handleStartCooking = async (orderId: number) => {
    setError("");
    try {
      await updateOrderStatus(orderId, "PREPARING");
      await refresh();
    } catch {
      setError("Couldn't update the order");
    }
  };

  const handleMarkReady = async (orderId: number) => {
    setError("");
    try {
      await updateOrderStatus(orderId, "READY");
      await refresh();
    } catch {
      setError("Couldn't update the order");
    }
  };

  const handleComplete = async (orderId: number) => {
    setError("");
    try {
      await updateOrderStatus(orderId, "COMPLETED");
      await refresh();
    } catch {
      setError("Couldn't update the order");
    }
  };

  const handleReject = async () => {
    if (rejectingOrderId === null) return;

    setError("");

    try {
      await updateOrderStatus(rejectingOrderId, "CANCELLED");
      setRejectingOrderId(null);
      setRejectReason("");
      setRejectNote("");
      await refresh();
    } catch {
      setError("Couldn't reject the order");
    }
  };

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <>
        <BusinessSidebar />
        <main className="order-table-page">
          <p className="order-table-message">Loading...</p>
        </main>
      </>
    );
  }

  if (restaurantState === "forbidden") {
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

  if (!restaurant) {
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

  const visibleOrders = orders.filter((order) =>
    tab === "active"
      ? ACTIVE_STATUSES.includes(order.status)
      : COMPLETED_STATUSES.includes(order.status)
  );

  const rejectingOrder = orders.find((o) => o.id === rejectingOrderId) ?? null;

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

          <h1 className="order-table-title">{restaurant.name}</h1>
        </header>

        <div className="order-table-tabs">
          <button
            type="button"
            className={`order-table-tab ${tab === "active" ? "order-table-tab--active" : ""}`}
            onClick={() => setTab("active")}
          >
            New / In Progress
          </button>
          <button
            type="button"
            className={`order-table-tab ${tab === "completed" ? "order-table-tab--active" : ""}`}
            onClick={() => setTab("completed")}
          >
            Completed
          </button>
        </div>

        {error && <p className="order-table-error">{error}</p>}

        {!ordersLoaded && <p className="order-table-message">Loading...</p>}

        {ordersLoaded && visibleOrders.length === 0 && (
          <p className="order-table-message">No orders here yet.</p>
        )}

        <div className="order-table-list">
          {visibleOrders.map((order) => {
            const isOpen = openOrderId === order.id;
            const minutes = cookingMinutes[order.id] ?? 50;

            return (
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
                  <span className="order-row__total">{order.totalPrice} som</span>
                  <span className={`order-row__badge order-row__badge--${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                {order.status === "PENDING" && (
                  <div className="order-row__actions">
                    <button
                      type="button"
                      className="order-row__decline"
                      onClick={() => setRejectingOrderId(order.id)}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      className="order-row__accept"
                      onClick={() => setConfirmingAcceptId(order.id)}
                    >
                      Accept the order
                    </button>
                  </div>
                )}

                {order.status === "ACCEPTED" && !isOpen && (
                  <button
                    type="button"
                    className="order-row__more"
                    onClick={() => setOpenOrderId(order.id)}
                  >
                    Specify cooking time
                  </button>
                )}

                {order.status === "ACCEPTED" && isOpen && (
                  <div className="cooking-time">
                    <button
                      type="button"
                      onClick={() =>
                        setCookingMinutes((prev) => ({
                          ...prev,
                          [order.id]: Math.max(5, minutes - 5),
                        }))
                      }
                    >
                      −
                    </button>
                    <span>{minutes} min</span>
                    <button
                      type="button"
                      onClick={() =>
                        setCookingMinutes((prev) => ({
                          ...prev,
                          [order.id]: minutes + 5,
                        }))
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="cooking-time__start"
                      onClick={() => {
                        setOpenOrderId(null);
                        handleStartCooking(order.id);
                      }}
                    >
                      Start cooking
                    </button>
                  </div>
                )}

                {order.status === "PREPARING" && (
                  <button
                    type="button"
                    className="order-row__more"
                    onClick={() => handleMarkReady(order.id)}
                  >
                    Ready for pickup
                  </button>
                )}

                {order.status === "READY" && (
                  <button
                    type="button"
                    className="order-row__more"
                    onClick={() => handleComplete(order.id)}
                  >
                    Mark as completed
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {rejectingOrder && (
        <div className="reject-overlay" onClick={() => setRejectingOrderId(null)}>
          <div className="reject-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Order #{rejectingOrder.id}</h2>

            <div className="reject-panel__items">
              {rejectingOrder.items.map((item) => (
                <p key={item.id}>
                  {item.quantity} × {item.itemName}
                </p>
              ))}
              <p className="reject-panel__total">{rejectingOrder.totalPrice} som</p>
            </div>

            <p className="reject-panel__label">Select a reason</p>

            {REJECT_REASONS.map((reason) => (
              <label key={reason} className="reject-panel__option">
                <input
                  type="radio"
                  name="reject-reason"
                  checked={rejectReason === reason}
                  onChange={() => setRejectReason(reason)}
                />
                {reason}
              </label>
            ))}

            <label className="reject-panel__option">
              <input
                type="radio"
                name="reject-reason"
                checked={rejectReason === "Other"}
                onChange={() => setRejectReason("Other")}
              />
              Another reason
            </label>

            {rejectReason === "Other" && (
              <input
                type="text"
                className="reject-panel__note"
                placeholder="Enter text"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
              />
            )}

            <button
              type="button"
              className="reject-panel__submit"
              disabled={!rejectReason}
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {confirmingAcceptId !== null && (
        <div
          className="accept-confirm-overlay"
          onClick={() => setConfirmingAcceptId(null)}
        >
          <div
            className="accept-confirm-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="accept-confirm-panel__text">
              Accept the order for processing?
            </p>

            <div className="accept-confirm-panel__actions">
              <button
                type="button"
                className="accept-confirm-panel__cancel"
                onClick={() => setConfirmingAcceptId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="accept-confirm-panel__confirm"
                onClick={() => {
                  handleAccept(confirmingAcceptId);
                  setConfirmingAcceptId(null);
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
