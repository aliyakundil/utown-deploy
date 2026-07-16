import {
  createBrowserRouter,
} from "react-router-dom";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import RestaurantsPage from "../../features/restaurants/pages/RestaurantsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RestaurantsPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);