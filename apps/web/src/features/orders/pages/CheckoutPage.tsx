import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./CheckoutPage.css";

import BackButton from "../../../components/ui/BackButton/BackButton.tsx";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { getCart } from "../../cart/api/cart.api";
import { createOrder } from "../api/orders.api";
import type { Cart } from "../../cart/types/cart.types";

import UTIcon from "../../../assets/images/Vector.svg";
import FoodWordmark from "../../../assets/images/Category.svg";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart | null>(null);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CASH");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCart()
      .then((res) => setCart(res.data))
      .catch(() => setCart(null));
  }, []);

  const items = cart?.items ?? [];

  const total = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.priceSnapshot),
    0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Delivery address is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createOrder({
        deliveryAddress: address,
        customerNote: note || undefined,
        paymentMethod,
      });

      navigate(`/orders/${response.data.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't place the order");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar />

      <main className="checkout-page">
        <header className="checkout-header">
          <BackButton to="/cart" />

          <Link to="/home" className="checkout-header__logo">
            <img src={UTIcon} alt="" />
            <img src={FoodWordmark} alt="FOOD" />
          </Link>

          <button
            type="button"
            className="checkout-header__bell"
            aria-label="Notifications"
          >
            <NotificationBell ringColor="none" />
          </button>
        </header>

        <h1 className="checkout-title">Order Payment</h1>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label className="checkout-form__label" htmlFor="address">
            Delivery address
          </label>

          <input
            id="address"
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="checkout-form__input"
          />

          <label className="checkout-form__label" htmlFor="note">
            Note for the courier (optional)
          </label>

          <textarea
            id="note"
            placeholder="Leave at the door, call on arrival..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="checkout-form__textarea"
          />

          <span className="checkout-form__label">Payment</span>

          <div className="checkout-payment">
            <button
              type="button"
              className={`checkout-payment__option ${
                paymentMethod === "CASH" ? "checkout-payment__option--active" : ""
              }`}
              onClick={() => setPaymentMethod("CASH")}
            >
              Cash
            </button>

            <button
              type="button"
              className={`checkout-payment__option ${
                paymentMethod === "CARD" ? "checkout-payment__option--active" : ""
              }`}
              onClick={() => setPaymentMethod("CARD")}
            >
              Card
            </button>
          </div>

          <div className="checkout-summary">
            <div className="checkout-summary__row">
              <span>Order amount</span>
              <span>{total} som</span>
            </div>

            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <span>{total} som</span>
            </div>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button
            type="submit"
            className="checkout-pay-button"
            disabled={isSubmitting || items.length === 0}
          >
            Pay {total} som
          </button>
        </form>
      </main>
    </>
  );
}
