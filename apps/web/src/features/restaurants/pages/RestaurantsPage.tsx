import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./RestaurantsPage.css";

import BackButton from "../../../components/ui/BackButton/BackButton.tsx";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import FavoriteButton from "../../../components/ui/FavoriteButton/FavoriteButton";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { getRestaurants } from "../api/restaurants.api";
import { useFavorites } from "../../favorites/context/FavoritesContext";
import type { Restaurant } from "../types/restaurant.types";

import UTIcon from "../../../assets/images/Vector.svg";
import FoodWordmark from "../../../assets/images/Category.svg";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);

      getRestaurants(query)
        .then((res) => setRestaurants(res.data))
        .catch(() => setRestaurants([]))
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <Sidebar />

      <main className="restaurants-page">
      <header className="restaurants-header">
        <BackButton to="/home" />

        <Link to="/home" className="restaurants-header__logo">
          <img src={UTIcon} alt="" />
          <img src={FoodWordmark} alt="FOOD" />
        </Link>

        <button
          type="button"
          className="restaurants-header__bell"
          aria-label="Notifications"
        >
          <NotificationBell ringColor="none" />
        </button>
      </header>

      <div className="restaurants-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M21 21l-4.3-4.3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          placeholder="Search for cafes, restaurants and dishes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h1 className="restaurants-title">Establishments</h1>

      <section className="restaurants-list">
        {isLoading && (
          <p className="restaurants-list__empty">Loading...</p>
        )}

        {!isLoading && restaurants.length === 0 && (
          <p className="restaurants-list__empty">Nothing found</p>
        )}

        {restaurants.map((r) => (
          <Link
            key={r.id}
            to={`/restaurants/${r.id}`}
            className="restaurant-card"
          >
            <div className="restaurant-card__image">
              {r.imageUrl ? <img src={r.imageUrl} alt={r.name} /> : null}
            </div>

            <div className="restaurant-card__body">
              <p className="restaurant-card__name">{r.name}</p>
              <p className="restaurant-card__desc">{r.description}</p>

              {r.minimumOrder && (
                <p className="restaurant-card__min">
                  Min order: {r.minimumOrder} som
                </p>
              )}
            </div>

            <div className="restaurant-card__favorite">
              <FavoriteButton
                isFavorite={isFavorite(r.id)}
                onToggle={() => toggleFavorite(r.id)}
              />
            </div>
          </Link>
        ))}
      </section>
      </main>
    </>
  );
}
