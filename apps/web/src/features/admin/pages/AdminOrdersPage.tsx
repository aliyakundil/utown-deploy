import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminPages.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import { getAllOrders } from "../api/admin.api";
import type { AdminOrder } from "../types/admin.types";

type LoadState = "loading" | "forbidden" | "ready";

export default function AdminOrdersPage() {
  const navigate = useNavigate();

  const [state, setState] = useState<LoadState>("loading");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return loadOrders(1);
      })
      .catch(() => setState("forbidden"));
  }, []);

  function loadOrders(nextPage: number) {
    return getAllOrders(nextPage)
      .then((res) => {
        setOrders(res.data.orders);
        setPage(res.data.meta.page);
        setTotalPages(res.data.meta.totalPage);
        setState("ready");
      })
      .catch(() => setState("forbidden"));
  }

  if (state === "forbidden") {
    return (
      <>
        <AdminSidebar />
        <main className="admin-page">
          <AdminTopBar />
          <div className="admin-content">
            <p className="admin-message">
              This page is only available to administrators.
            </p>
            <button
              type="button"
              className="admin-home-button"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />

      <main className="admin-page">
        <AdminTopBar />

        <div className="admin-content">
          <p className="admin-breadcrumb">Home / Users / Orders</p>

          <div className="admin-page-head">
            <h1>Order History</h1>
          </div>

          {state === "loading" && (
            <p className="admin-message">Loading...</p>
          )}

          {state === "ready" && orders.length === 0 && (
            <p className="admin-message">No orders yet.</p>
          )}

          {state === "ready" && orders.length > 0 && (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Client</th>
                      <th>Establishment</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="admin-table__name">#{order.id}</td>
                        <td>
                          {order.user.name} · {order.user.phone}
                        </td>
                        <td>{order.restaurant.name}</td>
                        <td className="admin-table__muted">
                          {order.items
                            .map((item) => `${item.quantity}× ${item.itemName}`)
                            .join(", ")}
                        </td>
                        <td>{order.totalPrice} som</td>
                        <td>
                          <span className="admin-table__status admin-table__status--on">
                            {order.status}
                          </span>
                        </td>
                        <td className="admin-table__muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => loadOrders(page - 1)}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      className={
                        p === page ? "admin-pagination__active" : ""
                      }
                      onClick={() => loadOrders(p)}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => loadOrders(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
