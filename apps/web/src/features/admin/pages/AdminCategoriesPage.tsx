import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./AdminPages.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import { getCategoriesByRestaurant, deleteCategory } from "../api/admin.api";
import type { Category } from "../../restaurants/types/restaurant.types";

type LoadState = "loading" | "forbidden" | "ready";

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const rid = Number(restaurantId);

  const [state, setState] = useState<LoadState>("loading");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return loadCategories();
      })
      .catch(() => setState("forbidden"));
  }, [rid]);

  function loadCategories() {
    return getCategoriesByRestaurant(rid)
      .then((res) => {
        setCategories(res.data);
        setState("ready");
      })
      .catch(() => setState("forbidden"));
  }

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm("Delete this category permanently?")) return;

    setError("");

    try {
      await deleteCategory(categoryId);
      await loadCategories();
    } catch {
      setError("Couldn't delete the category");
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
          <p className="admin-breadcrumb">Home / Users / Establishments / Categories</p>

          <div className="admin-page-head">
            <h1>Categories</h1>

            <button
              type="button"
              className="admin-add-button"
              onClick={() => navigate(`/admin/restaurants/${rid}/categories/new`)}
            >
              + Add
            </button>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {state === "loading" && <p className="admin-message">Loading...</p>}

          {state === "ready" && categories.length === 0 && (
            <p className="admin-message">No categories yet.</p>
          )}

          {state === "ready" && categories.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Priority</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="admin-table__row-clickable"
                      onClick={() =>
                        navigate(
                          `/admin/restaurants/${rid}/categories/${category.id}/edit`
                        )
                      }
                    >
                      <td className="admin-table__name">{category.name}</td>
                      <td className="admin-table__muted">{category.priority}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="admin-table__link"
                          onClick={() => handleDelete(category.id)}
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
