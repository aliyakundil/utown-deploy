import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./RestaurantPage.css";

import FavoriteButton from "../../../components/ui/FavoriteButton/FavoriteButton";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { getRestaurantById } from "../api/restaurants.api";
import {
  addCartItem,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../cart/api/cart.api";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../../favorites/api/favorites.api";
import type { RestaurantDetail } from "../types/restaurant.types";
import type { CartItem } from "../../cart/types/cart.types";
import axios from "axios";

type CartLine = { cartItemId: number; quantity: number; price: number };

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [cartLines, setCartLines] = useState<Record<number, CartLine>>({});
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;

    getRestaurantById(Number(id))
      .then((res) => setRestaurant(res.data))
      .catch(() => setRestaurant(null));

    refreshCart();

    getFavorites()
      .then((res) =>
        setIsFavorite(res.data.some((f) => f.restaurantId === Number(id)))
      )
      .catch(() => {});
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!id) return;

    const restaurantId = Number(id);

    if (isFavorite) {
      setIsFavorite(false);
      await removeFavorite(restaurantId).catch(() => {});
    } else {
      setIsFavorite(true);
      await addFavorite(restaurantId).catch(() => {});
    }
  };

  function refreshCart() {
    getCart()
      .then((res) => syncCartLines(res.data.items))
      .catch(() => {});
  }

  function syncCartLines(items: CartItem[]) {
    const lines: Record<number, CartLine> = {};

    items.forEach((item) => {
      lines[item.menuItemId] = {
        cartItemId: item.id,
        quantity: item.quantity,
        price: Number(item.priceSnapshot),
      };
    });

    setCartLines(lines);
  }

  const cartCount = Object.values(cartLines).reduce(
    (sum, line) => sum + line.quantity,
    0
  );

  const cartTotal = Object.values(cartLines).reduce(
    (sum, line) => sum + line.quantity * line.price,
    0
  );

  const handleAdd = async (menuItemId: number) => {
    setError("");

    try {
      await addCartItem(menuItemId, 1);
      refreshCart();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ?? "Couldn't add this item"
        );
      }
    }
  };

  const handleQuantityChange = async (
    menuItemId: number,
    nextQuantity: number
  ) => {
    const line = cartLines[menuItemId];
    if (!line) return;

    if (nextQuantity < 1) {
      await removeCartItem(line.cartItemId);
    } else {
      await updateCartItem(line.cartItemId, nextQuantity);
    }

    refreshCart();
  };

  if (!restaurant) {
    return (
      <>
        <Sidebar />
        <main className="restaurant-page" />
      </>
    );
  }

  const categories = restaurant.categories.sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <>
      <Sidebar />

      <main className="restaurant-page">
      <div className="restaurant-page__image">
        {restaurant.imageUrl && (
          <img src={restaurant.imageUrl} alt={restaurant.name} />
        )}

        <div className="restaurant-page__image-top">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleToggleFavorite}
          />
        </div>
      </div>

      <div className="restaurant-page__body">
        <h1 className="restaurant-page__name">{restaurant.name}</h1>
        <p className="restaurant-page__desc">{restaurant.description}</p>

        {restaurant.minimumOrder && (
          <p className="restaurant-page__info">
            Min. order: {restaurant.minimumOrder} som
          </p>
        )}

        {error && <p className="restaurant-page__error">{error}</p>}

        {categories.map((category) => {
          const items = restaurant.menuItems.filter(
            (item) => item.categoryId === category.id && item.isAvailable
          );

          if (items.length === 0) return null;

          return (
            <section key={category.id} className="menu-category">
              <h2 className="menu-category__title">{category.name}</h2>

              <div className="menu-category__items">
                {items.map((item) => {
                  const line = cartLines[item.id];

                  return (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item__image">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} />
                        )}
                      </div>

                      <div className="menu-item__body">
                        <p className="menu-item__name">{item.name}</p>

                        {item.description && (
                          <p className="menu-item__desc">{item.description}</p>
                        )}

                        <p className="menu-item__price">{item.price} som</p>
                      </div>

                      {line ? (
                        <div className="menu-item__stepper">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              handleQuantityChange(item.id, line.quantity - 1)
                            }
                          >
                            −
                          </button>

                          <span>{line.quantity}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              handleQuantityChange(item.id, line.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="menu-item__add"
                          onClick={() => handleAdd(item.id)}
                        >
                          +
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {cartCount > 0 && (
        <button
          type="button"
          className="restaurant-page__cart-bar"
          onClick={() => navigate("/cart")}
        >
          <span>{cartCount} item{cartCount > 1 ? "s" : ""}</span>
          <span>View order · {cartTotal} som</span>
        </button>
      )}
      </main>
    </>
  );
}
