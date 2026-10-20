import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "./DeliveryPickerPage.css";

import { useMyRestaurant } from "../context/RestaurantContext";
import { updateRestaurant } from "../api/restaurateur.api";
import { DELIVERY_AREA_OPTIONS } from "../../restaurants/constants/establishment";

export default function DeliveryAreaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  const city = location.state?.city ?? restaurant?.city ?? "";

  const [area, setArea] = useState(restaurant?.deliveryArea ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!restaurant || !area) return;

    setError("");
    setIsSaving(true);

    try {
      await updateRestaurant(restaurant.id, { city, deliveryArea: area });
      await refreshRestaurant();
      navigate("/business/establishment");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the delivery area");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="delivery-picker-page">
      <h1 className="delivery-picker-title">Select delivery areas</h1>

      <div className="delivery-picker-list">
        {DELIVERY_AREA_OPTIONS.map((option) => (
          <label key={option} className="delivery-picker-row">
            <input
              type="radio"
              name="area"
              checked={area === option}
              onChange={() => setArea(option)}
            />
            <span className="delivery-picker-row__radio" />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {error && <p className="delivery-picker-error">{error}</p>}

      <button
        type="button"
        className="delivery-picker-next"
        disabled={!area || isSaving}
        onClick={handleSave}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </main>
  );
}