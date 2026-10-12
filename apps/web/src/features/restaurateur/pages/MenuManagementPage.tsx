import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./MenuManagementPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import {
  createCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api/restaurateur.api";

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant, refresh: refreshRestaurant } = useMyRestaurant();

  const [error, setError] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [openItemForm, setOpenItemForm] = useState<number | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  const openItemFormFor = (categoryId: number) => {
    setItemName("");
    setItemPrice("");
    setItemDescription("");
    setOpenItemForm(categoryId);
  };

  const closeItemForm = () => {
    setItemName("");
    setItemPrice("");
    setItemDescription("");
    setOpenItemForm(null);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!restaurant || !newCategoryName.trim()) return;

    try {
      await createCategory(restaurant.id, { name: newCategoryName.trim() });
      setNewCategoryName("");
      await refreshRestaurant();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't add category");
      }
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    setError("");

    try {
      await deleteCategory(categoryId);
      await refreshRestaurant();
    } catch {
      setError("Couldn't delete category — remove its items first");
    }
  };

  const handleAddItem = async (e: React.FormEvent, categoryId: number) => {
    e.preventDefault();
    setError("");

    if (!itemName.trim() || !itemPrice) return;

    try {
      await createMenuItem(categoryId, {
        name: itemName.trim(),
        price: Number(itemPrice),
        description: itemDescription.trim() || undefined,
      });

      setItemName("");
      setItemPrice("");
      setItemDescription("");
      setOpenItemForm(null);
      await refreshRestaurant();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't add item");
      }
    }
  };

  const handleToggleAvailable = async (
    menuItemId: number,
    isAvailable: boolean
  ) => {
    setError("");

    try {
      await updateMenuItem(menuItemId, { isAvailable: !isAvailable });
      await refreshRestaurant();
    } catch {
      setError("Couldn't update item");
    }
  };

  const handleDeleteItem = async (menuItemId: number) => {
    setError("");

    try {
      await deleteMenuItem(menuItemId);
      await refreshRestaurant();
    } catch {
      setError("Couldn't delete item");
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

  return (
    <>
      <BusinessSidebar />

      <main className="menu-mgmt-page">
        <BusinessTopBar onOpenMenu={open} />

        <h1 className="menu-mgmt-title">{restaurant.name}</h1>

        {error && <p className="menu-mgmt-error">{error}</p>}

        <div className="menu-mgmt-body">
          {categories.map((category) => {
            const items = restaurant.menuItems.filter(
              (item) => item.categoryId === category.id
            );

            return (
              <section key={category.id} className="menu-mgmt-category">
                <div className="menu-mgmt-category__header">
                  <h2>{category.name}</h2>

                  <button
                    type="button"
                    className="menu-mgmt-link-button"
                    disabled={items.length > 0}
                    onClick={() => handleDeleteCategory(category.id)}
                    title={
                      items.length > 0
                        ? "Remove all items first"
                        : "Delete category"
                    }
                  >
                    Delete
                  </button>
                </div>

                <div className="menu-mgmt-items">
                  {items.map((item) => (
                    <div key={item.id} className="menu-mgmt-item">
                      <div className="menu-mgmt-item__body">
                        <p className="menu-mgmt-item__name">{item.name}</p>
                        {item.description && (
                          <p className="menu-mgmt-item__desc">
                            {item.description}
                          </p>
                        )}
                        <p className="menu-mgmt-item__price">
                          {item.price} som
                        </p>
                      </div>

                      <div className="menu-mgmt-item__actions">
                        <button
                          type="button"
                          className={`menu-mgmt-toggle ${
                            item.isAvailable ? "menu-mgmt-toggle--on" : ""
                          }`}
                          onClick={() =>
                            handleToggleAvailable(item.id, item.isAvailable)
                          }
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </button>

                        <button
                          type="button"
                          className="menu-mgmt-link-button"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {openItemForm === category.id ? (
                  <form
                    className="menu-mgmt-item-form"
                    onSubmit={(e) => handleAddItem(e, category.id)}
                  >
                    <input
                      type="text"
                      placeholder="Item name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Price"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                    />

                    <div className="menu-mgmt-item-form__actions">
                      <button type="submit" className="menu-mgmt-primary-button">
                        Add item
                      </button>
                      <button
                        type="button"
                        className="menu-mgmt-link-button"
                        onClick={closeItemForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="menu-mgmt-add-item-button"
                    onClick={() => openItemFormFor(category.id)}
                  >
                    + Add item
                  </button>
                )}
              </section>
            );
          })}

          <form className="menu-mgmt-category-form" onSubmit={handleAddCategory}>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button type="submit" className="menu-mgmt-primary-button">
              + Add category
            </button>
          </form>
        </div>
      </main>
    </>
  );
}