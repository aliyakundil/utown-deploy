import { createBrowserRouter } from "react-router-dom";

import SplashPage from "../../features/auth/pages/SplashPage";
import AuthPage from "../../features/auth/pages/AuthPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import RecoverPasswordPage from "../../features/auth/pages/RecoverPasswordPage";
import VerificationPage from "../../features/auth/pages/VerificationPage";
import NewPasswordPage from "../../features/auth/pages/NewPasswordPage";
import HomePage from "../../features/home/pages/HomePage";
import FavouritesPage from "../../features/favorites/pages/FavouritesPage";
import RestaurantsPage from "../../features/restaurants/pages/RestaurantsPage";
import RestaurantPage from "../../features/restaurants/pages/RestaurantPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/recover-password",
    element: <RecoverPasswordPage />,
  },
  {
    path: "/verification",
    element: <VerificationPage />,
  },
  {
    path: "/new-password",
    element: <NewPasswordPage />,
  },
  {
    path: "/verify-code",
    element: <VerificationPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/favourites",
    element: <FavouritesPage />,
  },
  {
    path: "/restaurants",
    element: <RestaurantsPage />,
  },
  {
    path: "/restaurants/:id",
    element: <RestaurantPage />,
  },
]);