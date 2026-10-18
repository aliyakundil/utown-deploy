import { createBrowserRouter, Navigate } from "react-router-dom";

import RequireAuth from "../../components/auth/RequireAuth";

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
import EstablishmentPage from "../../features/restaurateur/pages/EstablishmentPage";
import StatisticsPage from "../../features/restaurateur/pages/StatisticsPage";
import WorkingHoursPage from "../../features/restaurateur/pages/WorkingHoursPage";
import WorkingHoursDayPage from "../../features/restaurateur/pages/WorkingHoursDayPage";
import AdminUsersPage from "../../features/admin/pages/AdminUsersPage";
import AdminClientFormPage from "../../features/admin/pages/AdminClientFormPage";
import AdminRestaurantsPage from "../../features/admin/pages/AdminRestaurantsPage";
import AdminEstablishmentFormPage from "../../features/admin/pages/AdminEstablishmentFormPage";
import AdminOrdersPage from "../../features/admin/pages/AdminOrdersPage";
import AdminCategoriesPage from "../../features/admin/pages/AdminCategoriesPage";
import AdminCategoryFormPage from "../../features/admin/pages/AdminCategoryFormPage";
import AdminMenuItemsPage from "../../features/admin/pages/AdminMenuItemsPage";
import AdminMenuItemFormPage from "../../features/admin/pages/AdminMenuItemFormPage";
import BusinessHomePage from "../../features/restaurateur/pages/BusinessHomePage";
import BusinessNotificationsPage from "../../features/restaurateur/pages/BusinessNotificationsPage";
import MenuManagementPage from "../../features/restaurateur/pages/MenuManagementPage";
import MenuEditHubPage from "../../features/restaurateur/pages/MenuEditHubPage";
import DishFormPage from "../../features/restaurateur/pages/DishFormPage";
import DishesOnHoldPage from "../../features/restaurateur/pages/DishesOnHoldPage";
import DeletedDishesPage from "../../features/restaurateur/pages/DeletedDishesPage";
import CategoriesHubPage from "../../features/restaurateur/pages/CategoriesHubPage";
import CategoriesListPage from "../../features/restaurateur/pages/CategoriesListPage";
import CategoryFormPage from "../../features/restaurateur/pages/CategoryFormPage";
import AdminNotificationsPage from "../../features/admin/pages/AdminNotificationsPage";

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
  path: "/business",
    element: (
      <RequireAuth>
        <BusinessHomePage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/orders",
    element: (
      <RequireAuth>
        <OrderTablePage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu",
    element: (
      <RequireAuth>
        <MenuManagementPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/establishment",
    element: (
      <RequireAuth>
        <EstablishmentPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/statistics",
    element: (
      <RequireAuth>
        <StatisticsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/establishment/hours",
    element: (
      <RequireAuth>
        <WorkingHoursPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/establishment/hours/:day",
    element: (
      <RequireAuth>
        <WorkingHoursDayPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <Navigate to="/admin/users" replace />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RequireAuth>
        <AdminUsersPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/users/new",
    element: (
      <RequireAuth>
        <AdminClientFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/users/:id/edit",
    element: (
      <RequireAuth>
        <AdminClientFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants",
    element: (
      <RequireAuth>
        <AdminRestaurantsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/new",
    element: (
      <RequireAuth>
        <AdminEstablishmentFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/:id/edit",
    element: (
      <RequireAuth>
        <AdminEstablishmentFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <RequireAuth>
        <AdminOrdersPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/notifications",
    element: (
      <RequireAuth>
        <AdminNotificationsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/:restaurantId/categories",
    element: (
      <RequireAuth>
        <AdminCategoriesPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/:restaurantId/categories/new",
    element: (
      <RequireAuth>
        <AdminCategoryFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/:restaurantId/categories/:categoryId/edit",
    element: (
      <RequireAuth>
        <AdminCategoryFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/:restaurantId/menu-items",
    element: (
      <RequireAuth>
        <AdminMenuItemsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/:restaurantId/menu-items/new",
    element: (
      <RequireAuth>
        <AdminMenuItemFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/admin/restaurants/:restaurantId/menu-items/:menuItemId/edit",
    element: (
      <RequireAuth>
        <AdminMenuItemFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/notifications",
    element: (
      <RequireAuth>
        <BusinessNotificationsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/edit",
    element: (
      <RequireAuth>
        <MenuEditHubPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/dishes/new",
    element: (
      <RequireAuth>
        <DishFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/dishes/:id/edit",
    element: (
      <RequireAuth>
        <DishFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/dishes/on-hold",
    element: (
      <RequireAuth>
        <DishesOnHoldPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/dishes/deleted",
    element: (
      <RequireAuth>
        <DeletedDishesPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/categories",
    element: (
      <RequireAuth>
        <CategoriesHubPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/categories/list",
    element: (
      <RequireAuth>
        <CategoriesListPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/categories/new",
    element: (
      <RequireAuth>
        <CategoryFormPage />
      </RequireAuth>
    ),
  },
  {
    path: "/business/menu/categories/:id/edit",
    element: (
      <RequireAuth>
        <CategoryFormPage />
      </RequireAuth>
    ),
  },
]);
