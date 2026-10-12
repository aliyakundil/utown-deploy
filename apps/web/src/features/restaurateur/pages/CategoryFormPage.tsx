import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./CategoryFormPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { uploadImage, resolveUploadUrl } from "../../../lib/upload";
import { createCategory, updateCategory, deleteCategory } from "../api/restaurateur.api";

export default function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  const categoryId = id ? Number(id) : null;
  const category = restaurant?.categories.find((c) => c.id === categoryId) ?? null;

  const [name, setName] = useState(category?.name ?? "");
  const [priority, setPriority] = useState(
    category ? String(category.priority) : ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [cannotDeleteError, setCannotDeleteError] = useState("");

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <main className="category-form-page">
        <p className="category-form-message">Loading...</p>
      </main>
    );
  }

  if (restaurantState === "forbidden" || !restaurant) {
    return (
      <main className="category-form-page">
        <p className="category-form-message">
          This page is only available to restaurant owners.
        </p>
      </main>
    );
  }

  if (categoryId && !category) {
    return (
      <>
        <BusinessSidebar />
        <main className="category-form-page">
          <p className="category-form-message">Category not found.</p>
        </main>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl: string | undefined;

      if (image) {
        setIsUploading(true);
        const uploaded = await uploadImage(image);
        imageUrl = resolveUploadUrl(uploaded.data.fileName);
        setIsUploading(false);
      }

      const payload = {
        name: name.trim(),
        priority: priority ? Number(priority) : undefined,
        ...(imageUrl && { imageUrl }),
      };

      if (category) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(restaurant.id, payload);
      }

      await refreshRestaurant();
      navigate("/business/menu/categories/list");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the category");
      }
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;

    try {
      await deleteCategory(category.id);
      setIsConfirmingDelete(false);
      await refreshRestaurant();
      navigate("/business/menu/categories/list");
    } catch {
      setIsConfirmingDelete(false);
      setCannotDeleteError(
        "The category cannot be deleted while it has active items"
      );
    }
  };

  return (
    <>
      <BusinessSidebar />

      <main className="category-form-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="category-form-title">
          {category ? "Edit category" : "Add new category"}
        </h1>

        <form className="category-form" onSubmit={handleSubmit}>
          <label className="category-form__label" htmlFor="name">
            Category name
          </label>
          <input
            id="name"
            className="category-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
          />

          <label className="category-form__label" htmlFor="image">
            Category image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="category-form__file"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />

          <label className="category-form__label" htmlFor="priority">
            Priority
          </label>
          <input
            id="priority"
            type="number"
            className="category-form__input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="1"
          />

          {error && <p className="category-form__error">{error}</p>}

          <button
            type="submit"
            className="category-form__save"
            disabled={isSaving}
          >
            {isUploading ? "Uploading..." : category ? "Save changes" : "Add new category"}
          </button>

          {category && (
            <button
              type="button"
              className="category-form__delete"
              onClick={() => setIsConfirmingDelete(true)}
            >
              Delete
            </button>
          )}
        </form>
      </main>

      {isConfirmingDelete && (
        <div className="category-form-overlay" onClick={() => setIsConfirmingDelete(false)}>
          <div className="category-form-modal" onClick={(e) => e.stopPropagation()}>
            <p className="category-form-modal__title">Delete category?</p>

            <button
              type="button"
              className="category-form-modal__delete"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="category-form-modal__cancel"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {cannotDeleteError && (
        <div className="category-form-overlay" onClick={() => setCannotDeleteError("")}>
          <div className="category-form-modal" onClick={(e) => e.stopPropagation()}>
            <p className="category-form-modal__title">Deleting</p>
            <p className="category-form-modal__text">{cannotDeleteError}</p>

            <button
              type="button"
              className="category-form-modal__cancel"
              onClick={() => setCannotDeleteError("")}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
}