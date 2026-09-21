import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./AdminPages.css";
import "./AdminClientFormPage.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import {
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  getCategoriesByRestaurant,
} from "../api/admin.api";
import type { Category } from "../../restaurants/types/restaurant.types";

type LoadState = "loading" | "forbidden" | "ready" | "no-categories";

export default function AdminMenuItemFormPage() {
  const navigate = useNavigate();
  const { restaurantId, menuItemId } = useParams();
  const rid = Number(restaurantId);
  const isEditing = Boolean(menuItemId);

  const [state, setState] = useState<LoadState>("loading");
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return getCategoriesByRestaurant(rid).then((catRes) => {
          setCategories(catRes.data);

          if (!isEditing) {
            if (catRes.data.length === 0) {
              setState("no-categories");
              return;
            }

            setCategoryId(String(catRes.data[0].id));
            setState("ready");
            return;
          }

          return getMenuItemById(Number(menuItemId)).then((res) => {
            setName(res.data.name);
            setDescription(res.data.description ?? "");
            setPrice(String(res.data.price));
            setCategoryId(String(res.data.categoryId));
            setState("ready");
          });
        });
      })
      .catch(() => setState("forbidden"));
  }, [menuItemId, isEditing, rid]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Position name is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        await updateMenuItem(Number(menuItemId), {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          categoryId: Number(categoryId),
        });
      } else {
        await createMenuItem(Number(categoryId), {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
        });
      }

      navigate(`/admin/restaurants/${rid}/menu-items`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the position");
      }
    } finally {
      setIsSaving(false);
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
          </div>
        </main>
      </>
    );
  }

  if (state === "no-categories") {
    return (
      <>
        <AdminSidebar />
        <main className="admin-page">
          <AdminTopBar />
          <div className="admin-content">
            <p className="admin-breadcrumb">
              Home / Users / Establishments / Positions / Add
            </p>
            <p className="admin-message">
              This establishment has no categories yet. Add a category first.
            </p>
            <button
              type="button"
              className="admin-add-button"
              onClick={() => navigate(`/admin/restaurants/${rid}/categories/new`)}
            >
              + Add category
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
          <p className="admin-breadcrumb">
            Home / Users / Establishments / Positions / {isEditing ? "Edit" : "Add"}
          </p>

          <h1 className="admin-form-title">
            {isEditing ? "Edit position" : "Add position"}
          </h1>

          {state === "loading" && <p className="admin-message">Loading...</p>}

          {state === "ready" && (
            <form className="admin-client-form" onSubmit={handleSubmit}>
              <div className="admin-client-form__image">
                <span>↑</span>
              </div>

              <label className="admin-client-form__label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="admin-client-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cheeseburger"
              />

              <label className="admin-client-form__label" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                className="admin-client-form__input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beef burger with cheese"
              />

              <label className="admin-client-form__label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="admin-client-form__input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label className="admin-client-form__label" htmlFor="price">
                Price (som)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                className="admin-client-form__input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="350"
              />

              {error && <p className="admin-error">{error}</p>}

              <div className="admin-client-form__actions">
                <button
                  type="button"
                  className="admin-client-form__cancel"
                  onClick={() => navigate(`/admin/restaurants/${rid}/menu-items`)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-client-form__save"
                  disabled={isSaving}
                >
                  {isEditing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
