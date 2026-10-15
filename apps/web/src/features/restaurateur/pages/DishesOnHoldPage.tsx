import { useNavigate } from "react-router-dom";

import "./MenuEditHubPage.css";
import "./DishListPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { updateMenuItem } from "../api/restaurateur.api";

export default function DishesOnHoldPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <main className="menu-edit-hub-page">
        <p className="menu-edit-hub-message">Loading...</p>
      </main>
    );
  }

  if (restaurantState === "forbidden" || !restaurant) {
    return (
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
    );
  }

  const items = restaurant.menuItems
    .filter((item) => !item.isAvailable && !item.isDeleted)
    .slice()
    .sort((a, b) => a.priority - b.priority);

  const handleRemoveFromHold = async (menuItemId: number) => {
    try {
      await updateMenuItem(menuItemId, { isAvailable: true });
      await refreshRestaurant();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <BusinessSidebar />

      <main className="menu-edit-hub-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="menu-edit-hub-title">Dishes on hold</h1>

        {items.length === 0 && (
          <p className="menu-edit-hub-message">No dishes on hold.</p>
        )}

        <div className="dish-list">
          {items.map((item) => (
            <div key={item.id} className="dish-list__row">
              <div className="dish-list__body">
                <p className="dish-list__name">{item.name}</p>
                <p className="dish-list__price">{item.price} won</p>
              </div>

              <button
                type="button"
                className="dish-list__action"
                onClick={() => handleRemoveFromHold(item.id)}
              >
                Remove from hold
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}