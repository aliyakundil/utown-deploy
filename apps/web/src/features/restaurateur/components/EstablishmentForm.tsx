import { useState } from "react";
import axios from "axios";

import { createRestaurant, updateRestaurant } from "../api/restaurateur.api";
import type { MyRestaurant } from "../types/restaurateur.types";
import { CATEGORY_OPTIONS } from "../../restaurants/constants/establishment";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Restaurant name is required");
      return;
    }

    setIsSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      minimumOrder: minimumOrder ? Number(minimumOrder) : undefined,
      category: category || undefined,
    };

    try {
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

      {restaurant && (
        <>
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
        {restaurant ? "Save changes" : "Create restaurant"}
      </button>
    </form>
  );
}