import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./WorkingHoursPage.css";

import { useMyRestaurant } from "../context/RestaurantContext";
import { updateRestaurant } from "../api/restaurateur.api";
import type { WorkingHours } from "../../restaurants/types/restaurant.types";
import { DAYS, buildDefaultWorkingHours } from "../../restaurants/constants/establishment";

import LogoBusiness from "../../../assets/images/LogoBusiness.svg";

export default function WorkingHoursDayPage() {
  const navigate = useNavigate();
  const { day } = useParams<{ day: string }>();
  const { state: restaurantState, restaurant, refresh } = useMyRestaurant();

  const dayInfo = DAYS.find((d) => d.key === day);

  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const hours = workingHours ?? restaurant?.workingHours ?? buildDefaultWorkingHours();

  const handleSave = async () => {
    if (!restaurant || !dayInfo) return;

    setIsSaving(true);

    try {
      await updateRestaurant(restaurant.id, { workingHours: hours });
      await refresh();
      navigate("/business/establishment/hours");
    } finally {
      setIsSaving(false);
    }
  };

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <main className="working-hours-page">
        <p className="working-hours-message">Loading...</p>
      </main>
    );
  }

  if (restaurantState === "forbidden" || !restaurant || !dayInfo) {
    return (
      <main className="working-hours-page">
        <p className="working-hours-message">
          {!dayInfo
            ? "Day not found."
            : !restaurant
            ? "You don't have a restaurant yet."
            : "This page is only available to restaurant owners."}
        </p>
      </main>
    );
  }

  const current = hours[dayInfo.key] ?? { isClosed: false, open: "09:00", close: "22:00" };

  return (
    <main className="working-hours-page">
      <header className="working-hours-header">
        <button
          type="button"
          className="working-hours-back"
          aria-label="Back"
          onClick={() => navigate("/business/establishment/hours")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <img src={LogoBusiness} alt="UT.BUSINESS" className="working-hours-logo" />
      </header>

      <div className="working-hours-day">
        <h1 className="working-hours-day__title">{dayInfo.label}</h1>

        <label className="working-hours-day__label" htmlFor="start-time">
          Start time
        </label>
        <input
          id="start-time"
          type="time"
          className="working-hours-day__input"
          value={current.open ?? "09:00"}
          disabled={current.isClosed}
          onChange={(e) =>
            setWorkingHours({
              ...hours,
              [dayInfo.key]: { ...current, open: e.target.value },
            })
          }
        />

        <label className="working-hours-day__label" htmlFor="end-time">
          End time
        </label>
        <input
          id="end-time"
          type="time"
          className="working-hours-day__input"
          value={current.close ?? "22:00"}
          disabled={current.isClosed}
          onChange={(e) =>
            setWorkingHours({
              ...hours,
              [dayInfo.key]: { ...current, close: e.target.value },
            })
          }
        />

        <label className="working-hours-day__toggle">
          <span>Mark as a day off</span>
          <input
            type="checkbox"
            checked={current.isClosed}
            onChange={(e) =>
              setWorkingHours({
                ...hours,
                [dayInfo.key]: { ...current, isClosed: e.target.checked },
              })
            }
          />
          <span className="working-hours-day__switch" />
        </label>

        <button
          type="button"
          className="working-hours-day__save"
          disabled={isSaving}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </main>
  );
}
