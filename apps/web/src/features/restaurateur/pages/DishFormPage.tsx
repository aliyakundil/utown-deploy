import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./DishFormPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import ImageUploadField from "../../../components/ui/ImageUploadField/ImageUploadField";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { uploadImage, resolveUploadUrl } from "../../../lib/upload";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api/restaurateur.api";

interface OptionDraft {
  name: string;
  extraPrice: string;
}

export default function DishFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  const itemId = id ? Number(id) : null;
  const item = restaurant?.menuItems.find((i) => i.id === itemId) ?? null;

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? item.price : "");
  const [priority, setPriority] = useState(item ? String(item.priority) : "");
  const [categoryId, setCategoryId] = useState(
    item ? String(item.categoryId) : ""
  );
  const [isOnHold, setIsOnHold] = useState(item ? !item.isAvailable : false);
  const [image, setImage] = useState<File | null>(null);
  const [options, setOptions] = useState<OptionDraft[]>(
    item?.options.map((o) => ({ name: o.name, extraPrice: o.extraPrice })) ?? []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const addOptionRow = () => {
    setOptions((prev) => [...prev, { name: "", extraPrice: "" }]);
  };

  const updateOptionRow = (index: number, patch: Partial<OptionDraft>) => {
    setOptions((prev) =>
      prev.map((option, i) => (i === index ? { ...option, ...patch } : option))
    );
  };

  const removeOptionRow = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <main className="dish-form-page">
        <p className="dish-form-message">Loading...</p>
      </main>
    );
  }

  if (restaurantState === "forbidden" || !restaurant) {
    return (
      <main className="dish-form-page">
        <p className="dish-form-message">
          This page is only available to restaurant owners.
        </p>
      </main>
    );
  }

  if (itemId && !item) {
    return (
      <>
        <BusinessSidebar />
        <main className="dish-form-page">
          <p className="dish-form-message">Dish not found.</p>
        </main>
      </>
    );
  }

  const categories = restaurant.categories.slice().sort((a, b) => a.priority - b.priority);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Dish name is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (!item && !categoryId) {
      setError("Select a category");
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

      const cleanOptions = options
        .filter((o) => o.name.trim())
        .map((o) => ({ name: o.name.trim(), extraPrice: Number(o.extraPrice) || 0 }));

      if (item) {
        await updateMenuItem(item.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          priority: priority ? Number(priority) : undefined,
          isAvailable: !isOnHold,
          categoryId: categoryId ? Number(categoryId) : undefined,
          ...(imageUrl && { imageUrl }),
          options: cleanOptions,
        });
      } else {
        await createMenuItem(Number(categoryId), {
          name: name.trim(),
          description: description.trim() || undefined,
          price: Number(price),
          priority: priority ? Number(priority) : undefined,
          ...(imageUrl && { imageUrl }),
          ...(cleanOptions.length > 0 && { options: cleanOptions }),
        });
      }

      await refreshRestaurant();
      navigate("/business/menu");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the dish");
      }
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteMenuItem(item.id);
      await refreshRestaurant();
      navigate("/business/menu");
    } catch {
      setError("Couldn't delete the dish");
    }
  };

  return (
    <>
      <BusinessSidebar />

      <main className="dish-form-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="dish-form-title">{item ? "Edit dish" : "Add dish"}</h1>

        <form className="dish-form" onSubmit={handleSubmit}>
          <label className="dish-form__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="dish-form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dish name"
          />

          <label className="dish-form__label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="dish-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beef, zucchini, celery, cheese, pepper, cheese crusts, etc."
          />

          <ImageUploadField
            id="image"
            label="Product image"
            value={image}
            onChange={setImage}
            existingUrl={item?.imageUrl}
          />

          <label className="dish-form__label" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="1"
            className="dish-form__input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="7,000"
          />

          <span className="dish-form__label">Options</span>
          <div className="dish-form__options">
            {options.map((option, index) => (
              <div key={index} className="dish-form__option-row">
                <input
                  type="text"
                  placeholder="Option name"
                  value={option.name}
                  onChange={(e) => updateOptionRow(index, { name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={option.extraPrice}
                  onChange={(e) => updateOptionRow(index, { extraPrice: e.target.value })}
                />
                <button
                  type="button"
                  className="dish-form__option-remove"
                  onClick={() => removeOptionRow(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="dish-form__add-option"
              onClick={addOptionRow}
            >
              + Add option
            </button>
          </div>

          <label className="dish-form__label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="dish-form__input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label className="dish-form__label" htmlFor="priority">
            Priority
          </label>
          <input
            id="priority"
            type="number"
            className="dish-form__input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="4"
          />

          <label className="dish-form__hold">
            <span>
              Put on hold
              <span className="dish-form__hold-hint">
                The dish remains on the menu but is not available for order
              </span>
            </span>
            <input
              type="checkbox"
              checked={isOnHold}
              onChange={(e) => setIsOnHold(e.target.checked)}
            />
            <span className="dish-form__hold-switch" />
          </label>

          {error && <p className="dish-form__error">{error}</p>}

          <button type="submit" className="dish-form__save" disabled={isSaving}>
            {isUploading ? "Uploading..." : item ? "Save changes" : "Add to menu"}
          </button>

          {item && (
            <button type="button" className="dish-form__delete" onClick={handleDelete}>
              Delete
            </button>
          )}
        </form>
      </main>
    </>
  );
}