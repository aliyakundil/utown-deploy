import "./MenuEditHubPage.css";
import "./DishListPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { restoreMenuItem } from "../api/restaurateur.api";

export default function DeletedDishesPage() {
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
      </main>
    );
  }

  const items = restaurant.menuItems
    .filter((item) => item.isDeleted)
    .slice()
    .sort((a, b) => a.priority - b.priority);

  const handleRestore = async (menuItemId: number) => {
    try {
      await restoreMenuItem(menuItemId);
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

        <h1 className="menu-edit-hub-title">Deleted</h1>

        {items.length === 0 && (
          <p className="menu-edit-hub-message">No deleted dishes.</p>
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
                onClick={() => handleRestore(item.id)}
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}