import { createBrowserRouter, Navigate } from "react-router-dom";

import SplashPage from "../../features/auth/pages/SplashPage";
import AuthPage from "../../features/auth/pages/AuthPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import RecoverPasswordPage from "../../features/auth/pages/RecoverPasswordPage";
import VerificationPage from "../../features/auth/pages/VerificationPage";
import NewPasswordPage from "../../features/auth/pages/NewPasswordPage";
import HomePage from "../../features/home/pages/HomePage";
import FavouritesPage from "../../features/favorites/pages/FavouritesPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import AccountSettingsPage from "../../features/profile/pages/AccountSettingsPage";
import PersonalInformationPage from "../../features/profile/pages/PersonalInformationPage";
import PasswordPage from "../../features/profile/pages/PasswordPage";
import InformationPage from "../../features/profile/pages/InformationPage";
import ContactSupportPage from "../../features/profile/pages/ContactSupportPage";
import NotificationsPage from "../../features/notifications/pages/NotificationsPage";
import RestaurantsPage from "../../features/restaurants/pages/RestaurantsPage";
import RestaurantPage from "../../features/restaurants/pages/RestaurantPage";
import CartPage from "../../features/cart/pages/CartPage";
import CheckoutPage from "../../features/orders/pages/CheckoutPage";
import OrderStatusPage from "../../features/orders/pages/OrderStatusPage";
import OrderHistoryPage from "../../features/orders/pages/OrderHistoryPage";
import AdminUsersPage from "../../features/admin/pages/AdminUsersPage";
import AdminClientFormPage from "../../features/admin/pages/AdminClientFormPage";
import AdminRestaurantsPage from "../../features/admin/pages/AdminRestaurantsPage";
import AdminEstablishmentFormPage from "../../features/admin/pages/AdminEstablishmentFormPage";
import AdminOrdersPage from "../../features/admin/pages/AdminOrdersPage";
import OrderTablePage from "../../features/restaurateur/pages/OrderTablePage";
import MenuManagementPage from "../../features/restaurateur/pages/MenuManagementPage";
import EstablishmentPage from "../../features/restaurateur/pages/EstablishmentPage";
import StatisticsPage from "../../features/restaurateur/pages/StatisticsPage";
import AdminCategoriesPage from "../../features/admin/pages/AdminCategoriesPage";
import AdminCategoryFormPage from "../../features/admin/pages/AdminCategoryFormPage";
import AdminMenuItemsPage from "../../features/admin/pages/AdminMenuItemsPage";
import AdminMenuItemFormPage from "../../features/admin/pages/AdminMenuItemFormPage";

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
    path: "/notifications",
    element: <NotificationsPage />,
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
    path: "/admin",
    element: <Navigate to="/admin/users" replace />,
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />,
  },
  {
    path: "/admin/users/new",
    element: <AdminClientFormPage />,
  },
  {
    path: "/admin/users/:id/edit",
    element: <AdminClientFormPage />,
  },
  {
    path: "/admin/restaurants",
    element: <AdminRestaurantsPage />,
  },
  {
    path: "/admin/restaurants/new",
    element: <AdminEstablishmentFormPage />,
  },
  {
    path: "/admin/restaurants/:id/edit",
    element: <AdminEstablishmentFormPage />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrdersPage />,
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
  {
    path: "/admin/restaurants/:restaurantId/categories",
    element: <AdminCategoriesPage />,
  },
  {
    path: "/admin/restaurants/:restaurantId/categories/new",
    element: <AdminCategoryFormPage />,
  },
  {
    path: "/admin/restaurants/:restaurantId/categories/:categoryId/edit",
    element: <AdminCategoryFormPage />,
  },
  {
    path: "/admin/restaurants/:restaurantId/menu-items",
    element: <AdminMenuItemsPage />,
  },
  {
    path: "/admin/restaurants/:restaurantId/menu-items/new",
    element: <AdminMenuItemFormPage />,
  },
  {
    path: "/admin/restaurants/:restaurantId/menu-items/:menuItemId/edit",
    element: <AdminMenuItemFormPage />,
  },
]);