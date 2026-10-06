import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getFavorites, addFavorite, removeFavorite } from "../api/favorites.api";
import type { Favorite } from "../types/favorite.types";

interface FavoritesContextValue {
  favorites: Favorite[];
  isLoading: boolean;
  isFavorite: (restaurantId: number) => boolean;
  toggleFavorite: (restaurantId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setIsLoading(false));
  }, []);

  const isFavorite = (restaurantId: number) =>
    favorites.some((f) => f.restaurantId === restaurantId);

  const toggleFavorite = async (restaurantId: number) => {
    const existing = favorites.find((f) => f.restaurantId === restaurantId);

    if (existing) {
      setFavorites((list) =>
        list.filter((f) => f.restaurantId !== restaurantId)
      );
      await removeFavorite(restaurantId).catch(() => {});
    } else {
      await addFavorite(restaurantId).catch(() => {});

      getFavorites()
        .then((res) => setFavorites(res.data))
        .catch(() => {});
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isLoading, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
