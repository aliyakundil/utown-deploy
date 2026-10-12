import { Link, useNavigate } from "react-router-dom";

import "./MenuEditHubPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";

export default function MenuEditHubPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant } = useMyRestaurant();

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <>
        <BusinessSidebar />
        <main className="menu-edit-hub-page">
          <p className="menu-edit-hub-message">Loading...</p>
        </main>
      </>
    );
  }

  if (restaurantState === "forbidden" || !restaurant) {
    return (
      <>
        <BusinessSidebar />
        <main className="menu-edit-hub-page">
          <p className="menu-edit-hub-message">
            This page is only available to restaurant owners.
          </p>
          <button
            type="button"
            className="menu-edit-hub-home-button"
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

      <main className="menu-edit-hub-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="menu-edit-hub-title">Edit Menu</h1>

        <div className="menu-edit-hub-list">
          <Link to="/business/menu/dishes/new" className="menu-edit-hub-row">
            <span>Add Dish</span>
            <span className="menu-edit-hub-row__chevron">›</span>
          </Link>

          <Link to="/business/menu/dishes/on-hold" className="menu-edit-hub-row">
            <span>Dishes on hold</span>
            <span className="menu-edit-hub-row__chevron">›</span>
          </Link>

          <Link to="/business/menu/dishes/deleted" className="menu-edit-hub-row">
            <span>Deleted</span>
            <span className="menu-edit-hub-row__chevron">›</span>
          </Link>

          <Link to="/business/menu/categories" className="menu-edit-hub-row">
            <span>Dish Categories</span>
            <span className="menu-edit-hub-row__chevron">›</span>
          </Link>
        </div>
      </main>
    </>
  );
}