import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./AdminPages.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import {
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem,
} from "../api/admin.api";
import type { MenuItem } from "../../restaurants/types/restaurant.types";

type LoadState = "loading" | "forbidden" | "ready";

interface MenuItemWithCategory extends MenuItem {
  category?: { id: number; name: string };
}

export default function AdminMenuItemsPage() {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const rid = Number(restaurantId);

  const [state, setState] = useState<LoadState>("loading");
  const [items, setItems] = useState<MenuItemWithCategory[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return loadItems();
      })
      .catch(() => setState("forbidden"));
  }, [rid]);

  function loadItems() {
    return getMenuItemsByRestaurant(rid)
      .then((res) => {
        setItems(res.data as MenuItemWithCategory[]);
        setState("ready");
      })
      .catch(() => setState("forbidden"));
  }

  const handleToggleHold = async (item: MenuItemWithCategory) => {
    setError("");

    try {
      await updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      await loadItems();
    } catch {
      setError("Couldn't update this position");
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm("Delete this position permanently?")) return;

    setError("");

    try {
      await deleteMenuItem(itemId);
      await loadItems();
    } catch {
      setError("Couldn't delete this position");
    }
  };

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
          <p className="admin-breadcrumb">Home / Users / Establishments / Positions</p>

          <div className="admin-page-head">
            <h1>Positions</h1>

            <button
              type="button"
              className="admin-add-button"
              onClick={() => navigate(`/admin/restaurants/${rid}/menu-items/new`)}
            >
              + Add
            </button>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {state === "loading" && <p className="admin-message">Loading...</p>}

          {state === "ready" && items.length === 0 && (
            <p className="admin-message">No positions yet.</p>
          )}

          {state === "ready" && items.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="admin-table__row-clickable"
                      onClick={() =>
                        navigate(`/admin/restaurants/${rid}/menu-items/${item.id}/edit`)
                      }
                    >
                      <td className="admin-table__name">{item.name}</td>
                      <td className="admin-table__muted">
                        {item.category?.name ?? "—"}
                      </td>
                      <td className="admin-table__muted">{item.price} som</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className={`admin-table__status ${
                            item.isAvailable ? "admin-table__status--on" : ""
                          }`}
                          onClick={() => handleToggleHold(item)}
                        >
                          {item.isAvailable ? "Available" : "On hold"}
                        </button>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="admin-table__link"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
