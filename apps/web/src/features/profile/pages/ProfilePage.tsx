import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./ProfilePage.css";

import BottomNav from "../../../components/layout/BottomNav/BottomNav";
import Sidebar from "../../../components/layout/Sidebar/Sidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { getMyProfile } from "../api/profile.api";
import { disconnectSocket } from "../../../lib/socket";

import Logo from "../../../assets/images/Vector.svg";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";

import AccountIcon from "../../../assets/images/setting-2.svg";
import InfoIcon from "../../../assets/images/Info icon.svg";
import FavouritesIcon from "../../../assets/images/Star.svg";
import SupportIcon from "../../../assets/images/Send Icon.svg";

import FoodIcon from "../../../assets/images/shopping-cart.svg";
import ConnectionIcon from "../../../assets/images/mobile.svg";
import ServicesIcon from "../../../assets/images/reserve.svg";
import JobsIcon from "../../../assets/images/wallet-check.svg";
import OrdersIcon from "../../../assets/images/sms-tracking.svg";

const quickActions = [
  { label: "Food", color: "var(--tile-purple)", icon: FoodIcon },
  { label: "Connection", color: "var(--tile-green)", icon: ConnectionIcon },
  { label: "Services", color: "var(--tile-blue)", icon: ServicesIcon },
  { label: "Jobs", color: "var(--tile-orange)", icon: JobsIcon },
];

const menuItems = [
  { label: "Account", icon: AccountIcon, to: "/profile/account" },
  { label: "Information", icon: InfoIcon, to: "/profile/information" },
  { label: "My Orders", icon: OrdersIcon, to: "/orders" },
  { label: "Favourites", icon: FavouritesIcon, to: "/favourites" },
  { label: "Contact Support", icon: SupportIcon, to: "/profile/contact-support" },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const { open } = useSidebar();

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setName(res.data.name);
        setRole(res.data.role);
      })
      .catch(() => setName(""));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    disconnectSocket();
    navigate("/login");
  };

  return (
    <>
      <Sidebar />

      <main className="profile-page">
      <header className="profile-header">
        <button
          type="button"
          className="profile-header__hamburger"
          aria-label="Open menu"
          onClick={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Link to="/home" className="profile-header__logo">
          <img src={Logo} alt="UTOWN" />
        </Link>

        <button
          type="button"
          className="profile-header__bell"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <NotificationBell ringColor="var(--color-black)" />
        </button>
      </header>

      <section className="profile-content">
        <h1 className="profile-greeting">Hello, {name || "User"}!</h1>

        <div className="profile-tiles">
          {quickActions.map((action) => (
            <div
              key={action.label}
              className="profile-tile"
              style={{ background: action.color }}
            >
              <img
                src={action.icon}
                alt=""
                className="profile-tile__icon"
              />
              <span>{action.label}</span>
            </div>
          ))}
        </div>

        <ul className="profile-menu">
          {[
            ...menuItems,
            ...(role === "ADMIN"
              ? [{ label: "Admin Panel", icon: AccountIcon, to: "/admin/users" }]
              : []),
          ].map((item) =>
            item.to ? (
              <li key={item.label} className="profile-menu__item">
                <Link to={item.to} className="profile-menu__link">
                  <img src={item.icon} alt="" />
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label} className="profile-menu__item">
                <img src={item.icon} alt="" />
                {item.label}
              </li>
            )
          )}
        </ul>

        <button
          type="button"
          className="profile-logout"
          onClick={handleLogout}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Log Out
        </button>
      </section>

      <BottomNav />
      </main>
    </>
  );
}
