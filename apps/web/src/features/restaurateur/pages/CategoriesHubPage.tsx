import { Link, useNavigate } from "react-router-dom";

import "./MenuEditHubPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";

export default function CategoriesHubPage() {
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

        <h1 className="menu-edit-hub-title">Categories of dishes</h1>

        <div className="menu-edit-hub-list">
          <Link to="/business/menu/categories/new" className="menu-edit-hub-row">
            <span>Add new category</span>
            <span className="menu-edit-hub-row__chevron">›</span>
          </Link>

          <Link to="/business/menu/categories/list" className="menu-edit-hub-row">
            <span>Edit categories</span>
            <span className="menu-edit-hub-row__chevron">›</span>
          </Link>
        </div>
      </main>
    </>
  );
}