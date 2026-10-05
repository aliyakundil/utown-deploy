import { useState } from "react";
import axios from "axios";

import { createRestaurant, updateRestaurant } from "../api/restaurateur.api";
import type { MyRestaurant } from "../types/restaurateur.types";
import type { DayHours, WorkingHours } from "../../restaurants/types/restaurant.types";

interface EstablishmentFormProps {
  restaurant: MyRestaurant | null;
  onSaved: () => Promise<void>;
}

const CATEGORY_OPTIONS = [
  "Korean BBQ",
  "Fried Chicken",
  "Bunsik",
  "Cafe & Desserts",
  "Noodles",
  "Bakery",
  "Fast food",
  "Other",
];

const DAYS: { key: keyof WorkingHours; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

function buildDefaultWorkingHours(): WorkingHours {
  const result = {} as WorkingHours;

  for (const { key } of DAYS) {
    result[key] = { isClosed: false, open: "09:00", close: "22:00" };
  }

  return result;
}

export default function EstablishmentForm({ restaurant, onSaved }: EstablishmentFormProps) {
  const [name, setName] = useState(restaurant?.name ?? "");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [address, setAddress] = useState(restaurant?.address ?? "");
  const [phone, setPhone] = useState(restaurant?.phone ?? "");
  const [minimumOrder, setMinimumOrder] = useState(restaurant?.minimumOrder ?? "");
  const [category, setCategory] = useState(restaurant?.category ?? "");
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    restaurant?.workingHours ?? buildDefaultWorkingHours()
  );
  const [status, setStatus] = useState<"OPEN" | "CLOSED">(restaurant?.status ?? "OPEN");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateDay = (day: keyof WorkingHours, patch: Partial<DayHours>) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...patch },
    }));
  };

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
      workingHours,
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

      <span className="establishment-form__label">Opening hours</span>
      <div className="establishment-hours">
        {DAYS.map(({ key, label }) => {
          const day = workingHours[key];

          return (
            <div key={key} className="establishment-hours__day">
              <span className="establishment-hours__day-label">{label}</span>

              <label className="establishment-hours__dayoff">
                <input
                  type="checkbox"
                  checked={day.isClosed}
                  onChange={(e) =>
                    updateDay(key, { isClosed: e.target.checked })
                  }
                />
                Day off
              </label>

              <input
                type="time"
                className="establishment-hours__time"
                value={day.open ?? "09:00"}
                disabled={day.isClosed}
                onChange={(e) => updateDay(key, { open: e.target.value })}
              />

              <span className="establishment-hours__dash">—</span>

              <input
                type="time"
                className="establishment-hours__time"
                value={day.close ?? "22:00"}
                disabled={day.isClosed}
                onChange={(e) => updateDay(key, { close: e.target.value })}
              />
            </div>
          );
        })}
      </div>

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