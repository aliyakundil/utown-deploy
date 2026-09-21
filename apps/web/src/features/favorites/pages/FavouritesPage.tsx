import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./FavouritesPage.css";

import BottomNav from "../../../components/layout/BottomNav/BottomNav";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import FavoriteButton from "../../../components/ui/FavoriteButton/FavoriteButton";
import HeartIcon from "../../../assets/images/heart.svg";
import Logo from "../../../assets/images/Logo.svg";
import { getFavorites, removeFavorite } from "../api/favorites.api";
import type { Favorite } from "../types/favorite.types";

export default function FavouritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { open } = useSidebar();

  useEffect(() => {
    loadFavorites();
  }, []);

  function loadFavorites() {
    getFavorites()
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setIsLoading(false));
  }

  const handleRemove = async (restaurantId: number) => {
    setFavorites((list) =>
      list.filter((f) => f.restaurantId !== restaurantId)
    );

    await removeFavorite(restaurantId).catch(() => {
      loadFavorites();
    });
  };

  return (
    <>
      <Sidebar />

      <main className="favourites-page">
      <header className="favourites-header">
        <button
          type="button"
          className="favourites-header__hamburger"
          aria-label="Open menu"
          onClick={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Link to="/home" className="favourites-header__logo">
          <img src={Logo} alt="UTOWN" />
        </Link>

        <button
          type="button"
          className="favourites-header__bell"
          aria-label="Notifications"
        >
          <NotificationBell
            color="var(--color-black)"
            ringColor="var(--color-white)"
          />
        </button>
      </header>

      <h1 className="favourites-title">Your Favourites</h1>

      <section className="favourites-content">
        {!isLoading && favorites.length === 0 && (
          <div className="favourites-empty">
            <img src={HeartIcon} alt="" />
            <p>You haven't added any favourites yet</p>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="favourites-list">
            {favorites.map((f) => (
              <Link
                key={f.id}
                to={`/restaurants/${f.restaurantId}`}
                className="restaurant-card"
              >
                <div className="restaurant-card__image">
                  {f.restaurant.imageUrl ? (
                    <img
                      src={f.restaurant.imageUrl}
                      alt={f.restaurant.name}
                    />
                  ) : null}
                </div>

                <div className="restaurant-card__body">
                  <p className="restaurant-card__name">
                    {f.restaurant.name}
                  </p>
                  <p className="restaurant-card__desc">
                    {f.restaurant.description}
                  </p>
                </div>

                <div className="restaurant-card__favorite">
                  <FavoriteButton
                    isFavorite
                    onToggle={() => handleRemove(f.restaurantId)}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
      </main>
    </>
  );
}
