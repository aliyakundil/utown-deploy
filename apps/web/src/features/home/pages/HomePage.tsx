import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./HomePage.css";

import BottomNav from "../../../components/layout/BottomNav/BottomNav";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { getRestaurants } from "../../restaurants/api/restaurants.api";
import type { Restaurant } from "../../restaurants/types/restaurant.types";
import { getMyProfile } from "../../profile/api/profile.api";

import Logo from "../../../assets/images/Vector.svg";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import CartIcon from "../../../assets/images/shopping-cart.svg";
import MobileIcon from "../../../assets/images/mobile.svg";
import FoodIcon from "../../../assets/images/reserve.svg";
import ServicesIcon from "../../../assets/images/sms-tracking.svg";
import JobsIcon from "../../../assets/images/wallet-check.svg";

const quickActions = [
  {
    label: "Food delivery",
    color: "var(--tile-purple)",
    icon: FoodIcon,
    to: "/restaurants",
  },
  {
    label: "Mobile connection",
    color: "var(--tile-green)",
    icon: MobileIcon,
    to: null,
  },
  {
    label: "Services",
    color: "var(--tile-blue)",
    icon: ServicesIcon,
    to: null,
  },
  {
    label: "Jobs",
    color: "var(--tile-orange)",
    icon: JobsIcon,
    to: null,
  },
];

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState("");
  const { open } = useSidebar();

  useEffect(() => {
    getRestaurants(undefined, 6)
      .then((res) => setRestaurants(res.data))
      .catch(() => setRestaurants([]));

    getMyProfile()
      .then((res) => setName(res.data.name))
      .catch(() => setName(""));
  }, []);

  return (
    <>
      <Sidebar />

      <main className="home-page">
        <header className="home-header">
          <button
            type="button"
            className="home-header__hamburger"
            aria-label="Open menu"
            onClick={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <img
            src={Logo}
            alt="UTOWN"
            className="home-header__logo"
          />

          <button
            type="button"
            className="home-header__bell"
            aria-label="Notifications"
          >
            <NotificationBell ringColor="none" />
          </button>
        </header>

      <section className="home-content">
        <h1 className="home-greeting">Hello, {name || "User"}!</h1>

        <div className="home-status-row">
          <div className="home-status-card">
            <span className="home-status-card__label">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 13.43a3.11 3.11 0 1 0 0-6.22 3.11 3.11 0 0 0 0 6.22Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              City name
            </span>
            <span className="home-status-card__value">+12°</span>
            <span className="home-status-card__hint">
              Sunny · ↓+10° ↑+17°
            </span>
          </div>

          <div className="home-status-card home-status-card--dark">
            <img
              src={CartIcon}
              alt=""
              className="home-status-card__icon"
            />
            <span className="home-status-card__label">Your active orders</span>
          </div>
        </div>

        <div className="home-tiles">
          {quickActions.map((action) =>
            action.to ? (
              <Link
                key={action.label}
                to={action.to}
                className="home-tile"
                style={{ background: action.color }}
              >
                <img
                  src={action.icon}
                  alt=""
                  className="home-tile__icon"
                />
                <span>{action.label}</span>
              </Link>
            ) : (
              <div
                key={action.label}
                className="home-tile home-tile--disabled"
                style={{ background: action.color }}
              >
                <img
                  src={action.icon}
                  alt=""
                  className="home-tile__icon"
                />
                <span>{action.label}</span>
              </div>
            )
          )}
        </div>

        <section className="home-section">
          <div className="home-section__header">
            <h2>Food delivery</h2>
            <Link to="/restaurants">More</Link>
          </div>

          <div className="home-cards">
            {restaurants.length === 0 && (
              <p className="home-cards__empty">No restaurants yet</p>
            )}

            {restaurants.map((r) => (
              <Link
                key={r.id}
                to={`/restaurants/${r.id}`}
                className="home-card"
              >
                <div className="home-card__image">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt={r.name} />
                  ) : null}
                </div>

                <p className="home-card__name">{r.name}</p>
                <p className="home-card__desc">{r.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>

        <BottomNav />
      </main>
    </>
  );
}
