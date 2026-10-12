import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DeliveryPickerPage.css";

import { useMyRestaurant } from "../context/RestaurantContext";
import { CITY_OPTIONS } from "../../restaurants/constants/establishment";

export default function DeliveryCityPage() {
  const navigate = useNavigate();
  const { restaurant } = useMyRestaurant();

  const [city, setCity] = useState(restaurant?.city ?? "");

  const handleNext = () => {
    if (!city) return;

    navigate("/business/establishment/delivery-area", {
      state: { city },
    });
  };

  return (
    <main className="delivery-picker-page">
      <h1 className="delivery-picker-title">Select delivery city</h1>

      <div className="delivery-picker-list">
        {CITY_OPTIONS.map((option) => (
          <label key={option} className="delivery-picker-row">
            <input
              type="radio"
              name="city"
              checked={city === option}
              onChange={() => setCity(option)}
            />
            <span className="delivery-picker-row__radio" />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        className="delivery-picker-next"
        disabled={!city}
        onClick={handleNext}
      >
        Next
      </button>
    </main>
  );
}