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
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAdds, setPendingAdds] = useState<Set<number>>(new Set());
  const [pendingRemoves, setPendingRemoves] = useState<Set<number>>(new Set());

  const load = () => {
    setIsLoading(true);

    return getFavorites()
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const isFavorite = (restaurantId: number) => {
    if (pendingAdds.has(restaurantId)) return true;
    if (pendingRemoves.has(restaurantId)) return false;
    return favorites.some((f) => f.restaurantId === restaurantId);
  };

  const toggleFavorite = async (restaurantId: number) => {
    if (pendingAdds.has(restaurantId) || pendingRemoves.has(restaurantId)) return;

    const currentlyFavorite = isFavorite(restaurantId);
    const setPending = currentlyFavorite ? setPendingRemoves : setPendingAdds;


    setPending((s) => new Set(s).add(restaurantId));

    try {
      if (currentlyFavorite) {
        await removeFavorite(restaurantId);
      } else {
        await addFavorite(restaurantId);
      }
    } catch {
      // ничего — ниже всё равно пересинхронизируем с сервером
    } finally {
      await load();
      setPending((s) => {
        const next = new Set(s);
        next.delete(restaurantId);
        return next;
      });
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isLoading, isFavorite, toggleFavorite, refresh: load }}
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