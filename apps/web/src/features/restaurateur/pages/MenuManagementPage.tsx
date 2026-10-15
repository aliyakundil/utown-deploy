import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./MenuManagementPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { updateMenuItem } from "../api/restaurateur.api";

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  const [error, setError] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const handleToggleHold = async (menuItemId: number, isAvailable: boolean) => {
    setError("");

    try {
      await updateMenuItem(menuItemId, { isAvailable: !isAvailable });
      await refreshRestaurant();
    } catch {
      setError("Couldn't update item");
    }
  };

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <>
        <BusinessSidebar />
        <main className="menu-mgmt-page">
          <p className="menu-mgmt-message">Loading...</p>
        </main>
      </>
    );
  }

  if (restaurantState === "forbidden") {
    return (
      <>
        <BusinessSidebar />
        <main className="menu-mgmt-page">
          <p className="menu-mgmt-message">
            This page is only available to restaurant owners.
          </p>
          <button
            type="button"
            className="menu-mgmt-home-button"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </main>
      </>
    );
  }

  if (!restaurant) {
    return (
      <>
        <BusinessSidebar />
        <main className="menu-mgmt-page">
          <p className="menu-mgmt-message">You don't have a restaurant yet.</p>
        </main>
      </>
    );
  }

  const categories = restaurant.categories.slice().sort((a, b) => a.priority - b.priority);
  const currentCategoryId = activeCategoryId ?? categories[0]?.id ?? null;

  const items = restaurant.menuItems
    .filter((item) => item.categoryId === currentCategoryId && !item.isDeleted)
    .slice()
    .sort((a, b) => a.priority - b.priority);

  return (
    <>
      <BusinessSidebar />

      <main className="menu-mgmt-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="menu-mgmt-title">Menu</h1>

        {error && <p className="menu-mgmt-error">{error}</p>}

        {categories.length === 0 && (
          <p className="menu-mgmt-message">
            No categories yet. <Link to="/business/menu/categories/new">Add one</Link>
          </p>
        )}

        {categories.length > 0 && (
          <>
            <div className="menu-mgmt-tabs">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`menu-mgmt-tab ${
                    category.id === currentCategoryId ? "menu-mgmt-tab--active" : ""
                  }`}
                  onClick={() => setActiveCategoryId(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="menu-mgmt-body">
              {items.length === 0 && (
                <p className="menu-mgmt-message">No dishes in this category yet.</p>
              )}

              <div className="menu-mgmt-items">
                {items.map((item) => (
                  <div key={item.id} className="menu-mgmt-item">
                    <div className="menu-mgmt-item__thumb">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} />
                      ) : (
                        <div className="menu-mgmt-item__thumb--empty" />
                      )}
                    </div>

                    <div className="menu-mgmt-item__body">
                      <p className="menu-mgmt-item__name">{item.name}</p>
                      {item.description && (
                        <p className="menu-mgmt-item__desc">{item.description}</p>
                      )}
                      <p className="menu-mgmt-item__price">{item.price} won</p>
                    </div>

                    <div className="menu-mgmt-item__actions">
                      <Link
                        to={`/business/menu/dishes/${item.id}/edit`}
                        className="menu-mgmt-edit-button"
                      >
                        Edit
                      </Link>

                      <label className="menu-mgmt-hold-toggle">
                        <input
                          type="checkbox"
                          checked={!item.isAvailable}
                          onChange={() => handleToggleHold(item.id, item.isAvailable)}
                        />
                        <span className="menu-mgmt-hold-toggle__switch" />
                        <span className="menu-mgmt-hold-toggle__label">
                          {item.isAvailable ? "Put on hold" : "Remove from hold"}
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Link to="/business/menu/edit" className="menu-mgmt-edit-menu-button">
          Edit Menu
        </Link>
      </main>
    </>
  );
}