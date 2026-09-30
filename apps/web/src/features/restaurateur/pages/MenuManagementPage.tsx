import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./MenuManagementPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { getMyProfile } from "../../profile/api/profile.api";
import {
  getMyRestaurants,
  createCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api/restaurateur.api";
import type { MyRestaurant } from "../types/restaurateur.types";

type LoadState = "loading" | "forbidden" | "no-restaurant" | "ready";

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();

  const [state, setState] = useState<LoadState>("loading");
  const [restaurant, setRestaurant] = useState<MyRestaurant | null>(null);
  const [error, setError] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [openItemForm, setOpenItemForm] = useState<number | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "RESTAURATEUR" && res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return loadRestaurant();
      })
      .catch(() => setState("forbidden"));
  }, []);

  function loadRestaurant() {
    return getMyRestaurants().then((res) => {
      const first = res.data[0];

      if (!first) {
        setState("no-restaurant");
        return;
      }

      setRestaurant(first);
      setState("ready");
    });
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!restaurant || !newCategoryName.trim()) return;

    try {
      await createCategory(restaurant.id, { name: newCategoryName.trim() });
      setNewCategoryName("");
      await loadRestaurant();
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
      await loadRestaurant();
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
      await loadRestaurant();
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
      await loadRestaurant();
    } catch {
      setError("Couldn't update item");
    }
  };

  const handleDeleteItem = async (menuItemId: number) => {
    setError("");

    try {
      await deleteMenuItem(menuItemId);
      await loadRestaurant();
    } catch {
      setError("Couldn't delete item");
    }
  };

  if (state === "forbidden") {
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

  if (state === "no-restaurant") {
    return (
      <>
        <BusinessSidebar />
        <main className="menu-mgmt-page">
          <p className="menu-mgmt-message">You don't have a restaurant yet.</p>
        </main>
      </>
    );
  }

  const categories = restaurant?.categories.slice().sort((a, b) => a.priority - b.priority) ?? [];

  return (
    <>
      <BusinessSidebar />

      <main className="menu-mgmt-page">
        <header className="menu-mgmt-header">
          <button
            type="button"
            className="menu-mgmt-hamburger"
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

          <h1 className="menu-mgmt-title">
            {restaurant ? restaurant.name : "Menu"}
          </h1>
        </header>

        {error && <p className="menu-mgmt-error">{error}</p>}

        {state === "loading" && (
          <p className="menu-mgmt-message">Loading...</p>
        )}

        <div className="menu-mgmt-body">
          {categories.map((category) => {
            const items = restaurant?.menuItems.filter(
              (item) => item.categoryId === category.id
            ) ?? [];

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
                        onClick={() => setOpenItemForm(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="menu-mgmt-add-item-button"
                    onClick={() => setOpenItemForm(category.id)}
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
