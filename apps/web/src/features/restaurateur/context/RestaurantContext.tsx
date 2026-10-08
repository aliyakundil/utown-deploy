import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { getMyProfile } from "../../profile/api/profile.api";
import { getMyRestaurants } from "../api/restaurateur.api";
import type { MyRestaurant } from "../types/restaurateur.types";

type RestaurantState = "idle" | "loading" | "forbidden" | "ready";

interface RestaurantContextValue {
  state: RestaurantState;
  restaurant: MyRestaurant | null;
  ensureLoaded: () => void;
  refresh: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RestaurantState>("idle");
  const [restaurant, setRestaurant] = useState<MyRestaurant | null>(null);
  const hasLoaded = useRef(false);

  const load = () => {
    setState("loading");

    return getMyProfile()
      .then((res) => {
        if (res.data.role !== "RESTAURATEUR" && res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return getMyRestaurants().then((res) => {
          setRestaurant(res.data[0] ?? null);
          setState("ready");
        });
      })
      .catch(() => setState("forbidden"));
  };

  const ensureLoaded = () => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      load();
    }
  };

  return (
    <RestaurantContext.Provider value={{ state, restaurant, ensureLoaded, refresh: load }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useMyRestaurant() {
  const context = useContext(RestaurantContext);

  if (!context) {
    throw new Error("useMyRestaurant must be used within a RestaurantProvider");
  }

  useEffect(() => {
    context.ensureLoaded();
  }, []);

  return context;
}
