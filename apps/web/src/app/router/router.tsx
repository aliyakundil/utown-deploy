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
import CartPage from "../../features/cart/pages/CartPage";
import CheckoutPage from "../../features/orders/pages/CheckoutPage";
import OrderStatusPage from "../../features/orders/pages/OrderStatusPage";
import OrderHistoryPage from "../../features/orders/pages/OrderHistoryPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import AccountSettingsPage from "../../features/profile/pages/AccountSettingsPage";
import PersonalInformationPage from "../../features/profile/pages/PersonalInformationPage";
import PasswordPage from "../../features/profile/pages/PasswordPage";
import InformationPage from "../../features/profile/pages/InformationPage";
import ContactSupportPage from "../../features/profile/pages/ContactSupportPage";
import OrderTablePage from "../../features/restaurateur/pages/OrderTablePage";
import MenuManagementPage from "../../features/restaurateur/pages/MenuManagementPage";
import EstablishmentPage from "../../features/restaurateur/pages/EstablishmentPage";
import StatisticsPage from "../../features/restaurateur/pages/StatisticsPage";

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
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/orders",
    element: <OrderHistoryPage />,
  },
  {
    path: "/orders/:id",
    element: <OrderStatusPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/profile/account",
    element: <AccountSettingsPage />,
  },
  {
    path: "/profile/personal-information",
    element: <PersonalInformationPage />,
  },
  {
    path: "/profile/password",
    element: <PasswordPage />,
  },
  {
    path: "/profile/information",
    element: <InformationPage />,
  },
  {
    path: "/profile/contact-support",
    element: <ContactSupportPage />,
  },
  {
    path: "/business/orders",
    element: <OrderTablePage />,
  },
  {
    path: "/business/menu",
    element: <MenuManagementPage />,
  },
  {
    path: "/business/establishment",
    element: <EstablishmentPage />,
  },
  {
    path: "/business/statistics",
    element: <StatisticsPage />,
  },
]);
