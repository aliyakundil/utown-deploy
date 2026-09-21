import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./AdminPages.css";
import "./AdminClientFormPage.css";
import "./AdminEstablishmentFormPage.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import {
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
} from "../api/admin.api";
import type {
  DayHours,
  WorkingHours,
} from "../../restaurants/types/restaurant.types";

type LoadState = "loading" | "forbidden" | "ready";

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

export default function AdminEstablishmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [state, setState] = useState<LoadState>("loading");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [category, setCategory] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    buildDefaultWorkingHours()
  );
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

        return getRestaurantById(Number(id)).then((res) => {
          const restaurant = res.data;

          setName(restaurant.name);
          setDescription(restaurant.description ?? "");
          setAddress(restaurant.address ?? "");
          setCity(restaurant.city ?? "");
          setPhone(restaurant.phone ?? "");
          setMinimumOrder(restaurant.minimumOrder ?? "");
          setCategory(restaurant.category ?? "");
          setDeliveryArea(restaurant.deliveryArea ?? "");
          setWorkingHours(restaurant.workingHours ?? buildDefaultWorkingHours());
          setState("ready");
        });
      })
      .catch(() => setState("forbidden"));
  }, [id, isEditing]);

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
      setError("Establishment name is required");
      return;
    }

    setIsSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      phone: phone.trim() || undefined,
      minimumOrder: minimumOrder ? Number(minimumOrder) : undefined,
      category: category || undefined,
      deliveryArea: deliveryArea.trim() || undefined,
      workingHours,
    };

    try {
      if (isEditing) {
        await updateRestaurant(Number(id), payload);
      } else {
        await createRestaurant(payload);
      }

      navigate("/admin/restaurants");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ?? "Couldn't save the establishment"
        );
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
            Home / Users / Establishments / {isEditing ? "Edit" : "Add"}
          </p>

          <h1 className="admin-form-title">
            {isEditing ? "Edit establishment" : "Add new establishment"}
          </h1>

          {isEditing && (
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <button
                type="button"
                className="admin-client-form__cancel"
                onClick={() => navigate(`/admin/restaurants/${id}/categories`)}
              >
                Manage categories →
              </button>
              <button
                type="button"
                className="admin-client-form__cancel"
                onClick={() => navigate(`/admin/restaurants/${id}/menu-items`)}
              >
                Manage positions →
              </button>
            </div>
          )}


          {state === "loading" && <p className="admin-message">Loading...</p>}

          {state === "ready" && (
            <form
              className="admin-establishment-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-establishment-form__image">
                <span>↑</span>
              </div>

              <div className="admin-establishment-form__grid">
                <div className="admin-establishment-form__field">
                  <label htmlFor="name">Restaurant name</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seoul BBQ"
                  />
                </div>

                <div className="admin-establishment-form__field">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
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
                </div>

                <div className="admin-establishment-form__field admin-establishment-form__field--wide">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Traditional Korean barbecue restaurant"
                  />
                </div>

                <div className="admin-establishment-form__field">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="25 Manasa Street"
                  />
                </div>

                <div className="admin-establishment-form__field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bishkek"
                  />
                </div>

                <div className="admin-establishment-form__field">
                  <label htmlFor="deliveryArea">Delivery area</label>
                  <input
                    id="deliveryArea"
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    placeholder="Center, Vostok 5"
                  />
                </div>

                <div className="admin-establishment-form__field">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+996700000000"
                  />
                </div>

                <div className="admin-establishment-form__field">
                  <label htmlFor="minimumOrder">Minimum order (som)</label>
                  <input
                    id="minimumOrder"
                    type="number"
                    min="0"
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(e.target.value)}
                    placeholder="500"
                  />
                </div>
              </div>

              <h2 className="admin-establishment-form__subtitle">
                Working hours
              </h2>

              <div className="admin-establishment-form__hours">
                {DAYS.map(({ key, label }) => {
                  const day = workingHours[key];

                  return (
                    <div key={key} className="admin-establishment-form__day">
                      <span className="admin-establishment-form__day-label">
                        {label}
                      </span>

                      <label className="admin-establishment-form__dayoff">
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
                        className="admin-establishment-form__time"
                        value={day.open ?? "09:00"}
                        disabled={day.isClosed}
                        onChange={(e) =>
                          updateDay(key, { open: e.target.value })
                        }
                      />

                      <span className="admin-establishment-form__dash">—</span>

                      <input
                        type="time"
                        className="admin-establishment-form__time"
                        value={day.close ?? "22:00"}
                        disabled={day.isClosed}
                        onChange={(e) =>
                          updateDay(key, { close: e.target.value })
                        }
                      />
                    </div>
                  );
                })}
              </div>

              {error && <p className="admin-error">{error}</p>}

              <div className="admin-client-form__actions">
                <button
                  type="button"
                  className="admin-client-form__cancel"
                  onClick={() => navigate("/admin/restaurants")}
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
