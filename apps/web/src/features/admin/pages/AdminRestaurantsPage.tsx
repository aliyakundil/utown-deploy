import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminPages.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import {
  getAllRestaurants,
  updateRestaurantStatus,
  deleteRestaurant,
} from "../api/admin.api";
import type { Restaurant } from "../../restaurants/types/restaurant.types";

type LoadState = "loading" | "forbidden" | "ready";

export default function AdminRestaurantsPage() {
  const navigate = useNavigate();

  const [state, setState] = useState<LoadState>("loading");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return loadRestaurants(1, "");
      })
      .catch(() => setState("forbidden"));
  }, []);

  function loadRestaurants(nextPage: number, nextSearch: string) {
    return getAllRestaurants(nextPage, nextSearch)
      .then((res) => {
        setRestaurants(res.data);
        setPage(res.meta.page);
        setTotalPages(res.meta.totalPages);
        setState("ready");
      })
      .catch(() => setState("forbidden"));
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRestaurants(1, search);
  };

  const handleToggleStatus = async (
    restaurantId: number,
    currentStatus: "OPEN" | "CLOSED"
  ) => {
    setError("");

    try {
      await updateRestaurantStatus(
        restaurantId,
        currentStatus === "OPEN" ? "CLOSED" : "OPEN"
      );
      await loadRestaurants(page, search);
    } catch {
      setError("Couldn't update the restaurant's status");
    }
  };

  const handleDelete = async (restaurantId: number) => {
    if (!window.confirm("Delete this establishment permanently?")) return;

    setError("");

    try {
      await deleteRestaurant(restaurantId);
      await loadRestaurants(page, search);
    } catch {
      setError("Couldn't delete the establishment");
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
          <p className="admin-breadcrumb">Home / Users / Establishments</p>

          <div className="admin-page-head">
            <h1>Establishments</h1>

            <div className="admin-page-controls">
              <form className="admin-page-controls" onSubmit={handleSearchSubmit}>
                <input
                  className="admin-search"
                  placeholder="Search by name or address"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="admin-search-button">
                  Search
                </button>
              </form>

              <button
                type="button"
                className="admin-add-button"
                onClick={() => navigate("/admin/restaurants/new")}
              >
                + Add
              </button>
            </div>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {state === "loading" && (
            <p className="admin-message">Loading...</p>
          )}

          {state === "ready" && (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Rating</th>
                      <th>Min. order</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((restaurant) => (
                      <tr
                        key={restaurant.id}
                        className="admin-table__row-clickable"
                        onClick={() =>
                          navigate(`/admin/restaurants/${restaurant.id}/edit`)
                        }
                      >
                        <td className="admin-table__name">
                          {restaurant.name}
                        </td>
                        <td className="admin-table__muted">
                          {restaurant.address || "—"}
                        </td>
                        <td className="admin-table__muted">
                          ★ {restaurant.averageRating.toFixed(1)} (
                          {restaurant.ratingsCount})
                        </td>
                        <td className="admin-table__muted">
                          {restaurant.minimumOrder
                            ? `${restaurant.minimumOrder} som`
                            : "—"}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={`admin-table__status ${
                              restaurant.status === "OPEN"
                                ? "admin-table__status--on"
                                : ""
                            }`}
                            onClick={() =>
                              handleToggleStatus(
                                restaurant.id,
                                restaurant.status
                              )
                            }
                          >
                            {restaurant.status}
                          </button>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="admin-table__link"
                            onClick={() => handleDelete(restaurant.id)}
                          >
                            Delete
                          </button>
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
                  onClick={() => loadRestaurants(page - 1, search)}
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
                      onClick={() => loadRestaurants(p, search)}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => loadRestaurants(page + 1, search)}
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
