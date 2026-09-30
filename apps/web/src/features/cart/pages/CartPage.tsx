import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./CartPage.css";

import BackButton from "../../../components/ui/BackButton/BackButton.tsx";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { getCart, updateCartItem, removeCartItem } from "../api/cart.api";
import type { Cart } from "../types/cart.types";

import UTIcon from "../../../assets/images/Vector.svg";
import FoodWordmark from "../../../assets/images/Category.svg";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  function loadCart() {
    getCart()
      .then((res) => setCart(res.data))
      .catch(() => setCart(null))
      .finally(() => setIsLoading(false));
  }

  const handleQuantityChange = async (
    itemId: number,
    nextQuantity: number
  ) => {
    if (nextQuantity < 1) {
      await removeCartItem(itemId);
    } else {
      await updateCartItem(itemId, nextQuantity);
    }

    loadCart();
  };

  const items = cart?.items ?? [];

  const total = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.priceSnapshot),
    0
  );

  return (
    <>
      <Sidebar />

      <main className="cart-page">
      <header className="cart-header">
        <BackButton to="/restaurants" />

        <Link to="/home" className="cart-header__logo">
          <img src={UTIcon} alt="" />
          <img src={FoodWordmark} alt="FOOD" />
        </Link>

        <button
          type="button"
          className="cart-header__bell"
          aria-label="Notifications"
        >
          <NotificationBell ringColor="none" />
        </button>
      </header>

      <h1 className="cart-title">Your order</h1>

      <div className="cart-items">
        {isLoading && <p className="cart-empty">Loading...</p>}

        {!isLoading && items.length === 0 && (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <Link to="/restaurants">Browse restaurants</Link>
          </div>
        )}

        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item__image">
              {item.menuItem.imageUrl && (
                <img
                  src={item.menuItem.imageUrl}
                  alt={item.menuItem.name}
                />
              )}
            </div>

            <div className="cart-item__body">
              <p className="cart-item__name">{item.menuItem.name}</p>

              {item.menuItem.description && (
                <p className="cart-item__desc">
                  {item.menuItem.description}
                </p>
              )}

              <p className="cart-item__price">{item.priceSnapshot} som</p>
            </div>

            <div className="cart-item__stepper">
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.id, item.quantity - 1)
                }
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(item.id, item.quantity + 1)
                }
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <button
          type="button"
          className="cart-checkout-bar"
          onClick={() => navigate("/checkout")}
        >
          <span>Proceed to payment</span>
          <span>{total} som</span>
        </button>
      )}
      </main>
    </>
  );
}
