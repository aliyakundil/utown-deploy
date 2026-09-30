import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./AdminPages.css";
import "./AdminClientFormPage.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "../api/admin.api";

type LoadState = "loading" | "forbidden" | "ready";

export default function AdminCategoryFormPage() {
  const navigate = useNavigate();
  const { restaurantId, categoryId } = useParams();
  const rid = Number(restaurantId);
  const isEditing = Boolean(categoryId);

  const [state, setState] = useState<LoadState>("loading");
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        if (!isEditing) {
          setState("ready");
          return;
        }

        return getCategoryById(Number(categoryId)).then((res) => {
          setName(res.data.name);
          setPriority(String(res.data.priority ?? 0));
          setState("ready");
        });
      })
      .catch(() => setState("forbidden"));
  }, [categoryId, isEditing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSaving(true);

    const payload = {
      name: name.trim(),
      priority: priority ? Number(priority) : undefined,
    };

    try {
      if (isEditing) {
        await updateCategory(Number(categoryId), payload);
      } else {
        await createCategory(rid, payload);
      }

      navigate(`/admin/restaurants/${rid}/categories`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the category");
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

  return (
    <>
      <AdminSidebar />

      <main className="admin-page">
        <AdminTopBar />

        <div className="admin-content">
          <p className="admin-breadcrumb">
            Home / Users / Establishments / Categories / {isEditing ? "Edit" : "Add"}
          </p>

          <h1 className="admin-form-title">
            {isEditing ? "Edit category" : "Add category"}
          </h1>

          {state === "loading" && <p className="admin-message">Loading...</p>}

          {state === "ready" && (
            <form className="admin-client-form" onSubmit={handleSubmit}>
              <div className="admin-client-form__image">
                <span>↑</span>
              </div>

              <label className="admin-client-form__label" htmlFor="name">
                Category name
              </label>
              <input
                id="name"
                className="admin-client-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Burgers"
              />

              <label className="admin-client-form__label" htmlFor="priority">
                Priority
              </label>
              <input
                id="priority"
                type="number"
                className="admin-client-form__input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="0"
              />

              {error && <p className="admin-error">{error}</p>}

              <div className="admin-client-form__actions">
                <button
                  type="button"
                  className="admin-client-form__cancel"
                  onClick={() => navigate(`/admin/restaurants/${rid}/categories`)}
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
