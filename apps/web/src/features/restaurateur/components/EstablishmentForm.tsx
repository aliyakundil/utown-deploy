import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { createRestaurant, updateRestaurant } from "../api/restaurateur.api";
import type { MyRestaurant } from "../types/restaurateur.types";
import { CATEGORY_OPTIONS } from "../../restaurants/constants/establishment";
import { uploadImage, resolveUploadUrl } from "../../../lib/upload";

interface EstablishmentFormProps {
  restaurant: MyRestaurant | null;
  onSaved: () => Promise<void>;
}

export default function EstablishmentForm({ restaurant, onSaved }: EstablishmentFormProps) {
  const [name, setName] = useState(restaurant?.name ?? "");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [address, setAddress] = useState(restaurant?.address ?? "");
  const [phone, setPhone] = useState(restaurant?.phone ?? "");
  const [minimumOrder, setMinimumOrder] = useState(restaurant?.minimumOrder ?? "");
  const [category, setCategory] = useState(restaurant?.category ?? "");
  const [status, setStatus] = useState<"OPEN" | "CLOSED">(restaurant?.status ?? "OPEN");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Restaurant name is required");
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
        description: description.trim() || undefined,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        minimumOrder: minimumOrder ? Number(minimumOrder) : undefined,
        category: category || undefined,
        ...(imageUrl && { imageUrl }),
      };

      if (restaurant) {
        await updateRestaurant(restaurant.id, {
          ...payload,
          status,
        });
      } else {
        await createRestaurant(payload);
      }

      await onSaved();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the restaurant");
      }
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return (
    <form className="establishment-form" onSubmit={handleSubmit}>
      <label className="establishment-form__label" htmlFor="name">
        Restaurant name
      </label>
      <input
        id="name"
        className="establishment-form__input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seoul BBQ"
      />

      <label className="establishment-form__label" htmlFor="description">
        Description
      </label>
      <textarea
        id="description"
        className="establishment-form__textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Traditional Korean barbecue restaurant"
      />

      <label className="establishment-form__label" htmlFor="address">
        Address
      </label>
      <input
        id="address"
        className="establishment-form__input"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="25 Manasa Street"
      />

      <label className="establishment-form__label" htmlFor="phone">
        Phone
      </label>
      <input
        id="phone"
        className="establishment-form__input"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+996700000000"
      />

      <label className="establishment-form__label" htmlFor="minimumOrder">
        Minimum order (som)
      </label>
      <input
        id="minimumOrder"
        type="number"
        min="0"
        className="establishment-form__input"
        value={minimumOrder}
        onChange={(e) => setMinimumOrder(e.target.value)}
        placeholder="500"
      />

      <label className="establishment-form__label" htmlFor="category">
        Category
      </label>
      <select
        id="category"
        className="establishment-form__input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <label className="establishment-form__label" htmlFor="image">
        Image of establishment
      </label>
      <input
        id="image"
        type="file"
        accept="image/*"
        className="establishment-form__file"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />

      {restaurant && (
        <>
          <span className="establishment-form__label">Delivery area</span>
          <Link
            to="/business/establishment/delivery-city"
            className="establishment-form__delivery-area"
          >
            {restaurant.city && restaurant.deliveryArea
              ? `${restaurant.city} — ${restaurant.deliveryArea}`
              : "Not set"}
            <span>›</span>
          </Link>

          <span className="establishment-form__label">Status</span>
          <div className="establishment-status">
            <button
              type="button"
              className={`establishment-status__option ${
                status === "OPEN" ? "establishment-status__option--active" : ""
              }`}
              onClick={() => setStatus("OPEN")}
            >
              Open
            </button>
            <button
              type="button"
              className={`establishment-status__option ${
                status === "CLOSED" ? "establishment-status__option--active" : ""
              }`}
              onClick={() => setStatus("CLOSED")}
            >
              Closed
            </button>
          </div>
        </>
      )}

      {error && <p className="establishment-error">{error}</p>}

      <button
        type="submit"
        className="establishment-save-button"
        disabled={isSaving}
      >
        {isUploading ? "Uploading..." : restaurant ? "Save changes" : "Create restaurant"}
      </button>
    </form>
  );
}