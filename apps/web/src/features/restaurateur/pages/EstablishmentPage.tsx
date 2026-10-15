import { useNavigate } from "react-router-dom";

import "./EstablishmentPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
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
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="establishment-title">
          {restaurant ? "Establishment" : "Create your restaurant"}
        </h1>

        <EstablishmentForm
          key={restaurant?.id ?? "new"}
          restaurant={restaurant}
          onSaved={refreshRestaurant}
        />
      </main>
    </>
  );
}