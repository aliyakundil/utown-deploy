import { useNavigate } from "react-router-dom";

import "./EstablishmentPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import EstablishmentForm from "../components/EstablishmentForm";

export default function EstablishmentPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <>
        <BusinessSidebar />
        <main className="establishment-page">
          <p className="establishment-message">Loading...</p>
        </main>
      </>
    );
  }

  if (restaurantState === "forbidden") {
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

        <EstablishmentForm
          key={restaurant?.id ?? "new"}
          restaurant={restaurant}
          onSaved={refreshRestaurant}
        />
      </main>
    </>
  );
}