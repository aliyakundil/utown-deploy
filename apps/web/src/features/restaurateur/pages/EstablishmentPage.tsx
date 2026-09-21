import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./EstablishmentPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { getMyProfile } from "../../profile/api/profile.api";
import {
  getMyRestaurants,
  createRestaurant,
  updateRestaurant,
} from "../api/restaurateur.api";
import type { MyRestaurant } from "../types/restaurateur.types";

type LoadState = "loading" | "forbidden" | "ready";

export default function EstablishmentPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();

  const [state, setState] = useState<LoadState>("loading");
  const [restaurant, setRestaurant] = useState<MyRestaurant | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [status, setStatus] = useState<"OPEN" | "CLOSED">("OPEN");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "RESTAURATEUR" && res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return getMyRestaurants().then((res) => {
          const first = res.data[0];

          if (first) {
            setRestaurant(first);
            setName(first.name);
            setDescription(first.description ?? "");
            setAddress(first.address ?? "");
            setPhone(first.phone ?? "");
            setMinimumOrder(first.minimumOrder ?? "");
            setStatus(first.status);
          }

          setState("ready");
        });
      })
      .catch(() => setState("forbidden"));
  }, []);

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
    };

    try {
      if (restaurant) {
        const response = await updateRestaurant(restaurant.id, {
          ...payload,
          status,
        });
        setRestaurant(response.data);
      } else {
        const response = await createRestaurant(payload);
        setRestaurant(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the restaurant");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (state === "forbidden") {
    return (
      <>
        <BusinessSidebar />
        <main className="establishment-page">
          <p className="establishment-message">
            This page is only available to restaurant owners.
          </p>
          <button
            type="button"
            className="establishment-home-button"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <BusinessSidebar />

      <main className="establishment-page">
        <header className="establishment-header">
          <button
            type="button"
            className="establishment-hamburger"
            aria-label="Open menu"
            onClick={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h1 className="establishment-title">
            {restaurant ? "Establishment" : "Create your restaurant"}
          </h1>
        </header>

        {state === "loading" && (
          <p className="establishment-message">Loading...</p>
        )}

        {state === "ready" && (
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

            {restaurant && (
              <>
                <span className="establishment-form__label">Status</span>
                <div className="establishment-status">
                  <button
                    type="button"
                    className={`establishment-status__option ${
                      status === "OPEN"
                        ? "establishment-status__option--active"
                        : ""
                    }`}
                    onClick={() => setStatus("OPEN")}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className={`establishment-status__option ${
                      status === "CLOSED"
                        ? "establishment-status__option--active"
                        : ""
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
        )}
      </main>
    </>
  );
}
