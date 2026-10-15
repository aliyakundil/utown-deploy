import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./BusinessHomePage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { updateRestaurant } from "../api/restaurateur.api";
import { DAYS } from "../../restaurants/constants/establishment";

export default function BusinessHomePage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleToggleSuspend = async () => {
    if (!restaurant || isSaving) return;

    const nextStatus = restaurant.status === "OPEN" ? "CLOSED" : "OPEN";

    setIsSaving(true);
    setError("");

    try {
      await updateRestaurant(restaurant.id, { status: nextStatus });
      await refreshRestaurant();
    } catch {
      setError("Couldn't update the restaurant status");
    } finally {
      setIsSaving(false);
    }
  };

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <>
        <BusinessSidebar />
        <main className="business-home-page">
          <p className="business-home-message">Loading...</p>
        </main>
      </>
    );
  }

  if (restaurantState === "forbidden") {
    return (
      <>
        <BusinessSidebar />
        <main className="business-home-page">
          <p className="business-home-message">
            This page is only available to restaurant owners.
          </p>
          <button
            type="button"
            className="business-home-hours-button"
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

      <main className="business-home-page">
        <BusinessTopBar onOpenMenu={open} />

        {!restaurant && (
          <div className="business-home-message">
            <p>You don't have a restaurant yet.</p>
            <Link to="/business/establishment">Create your restaurant</Link>
          </div>
        )}

        {restaurant && (
          <div className="business-home-content">
            <h1 className="business-home-title">{restaurant.name}</h1>

            {error && <p className="business-home-message">{error}</p>}

            <div className="business-home-suspend">
              <div className="business-home-suspend__text">
                <p className="business-home-suspend__title">
                  Suspend operations
                </p>
                <p className="business-home-suspend__subtitle">
                  Temporarily suspend the establishment's operations
                </p>
              </div>

              <button
                type="button"
                className={`business-home-toggle ${
                  restaurant.status === "CLOSED"
                    ? "business-home-toggle--on"
                    : ""
                }`}
                role="switch"
                aria-checked={restaurant.status === "CLOSED"}
                disabled={isSaving}
                onClick={handleToggleSuspend}
              >
                <span className="business-home-toggle__knob" />
              </button>
            </div>

            <h2 className="business-home-section-title">Navigation</h2>
            <div className="business-home-nav">
              <Link to="/business/orders" className="business-home-nav__item">
                Order table
              </Link>
              <Link
                to="/business/statistics"
                className="business-home-nav__item"
              >
                Statistics
              </Link>
              <Link to="/business/menu" className="business-home-nav__item">
                Menu
              </Link>
              <Link
                to="/business/establishment"
                className="business-home-nav__item"
              >
                Establishment
              </Link>
            </div>

            <h2 className="business-home-section-title">Working hours</h2>
            <div className="business-home-hours">
              {DAYS.map(({ key, label }) => {
                const day = restaurant.workingHours?.[key];

                return (
                  <div key={key} className="business-home-hours__day">
                    <span className="business-home-hours__label">
                      {label.slice(0, 3)}
                    </span>
                    <span className="business-home-hours__value">
                      {!day || day.isClosed
                        ? "Day off"
                        : `${day.open} - ${day.close}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="business-home-hours-button"
              onClick={() => navigate("/business/establishment/hours")}
            >
              Specify the establishment's working hours
            </button>
          </div>
        )}
      </main>
    </>
  );
}