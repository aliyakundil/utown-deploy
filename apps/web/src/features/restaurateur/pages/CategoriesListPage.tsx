import { Link, useNavigate } from "react-router-dom";

import "./MenuEditHubPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";

export default function CategoriesListPage() {
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

  const categories = restaurant.categories.slice().sort((a, b) => a.priority - b.priority);

  return (
    <>
      <BusinessSidebar />

      <main className="menu-edit-hub-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="menu-edit-hub-title">Categories</h1>

        {categories.length === 0 && (
          <p className="menu-edit-hub-message">No categories yet.</p>
        )}

        <div className="menu-edit-hub-list">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/business/menu/categories/${category.id}/edit`}
              className="menu-edit-hub-row"
            >
              <span>{category.name}</span>
              <span className="menu-edit-hub-row__chevron">Edit</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}