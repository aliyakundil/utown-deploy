import { NavLink } from "react-router-dom";

import "./BottomNav.css";

import HomeIcon from "../../../assets/images/Home.svg";
import HomeActiveIcon from "../../../assets/images/Home Active.svg";
import StarIcon from "../../../assets/images/Star.svg";
import StarActiveIcon from "../../../assets/images/Star Active.svg";
import ProfileIcon from "../../../assets/images/Profile.svg";
import ProfileActiveIcon from "../../../assets/images/Profile Active.svg";

const items = [
  { to: "/home", label: "Home", icon: HomeIcon, activeIcon: HomeActiveIcon },
  {
    to: "/favourites",
    label: "Favourites",
    icon: StarIcon,
    activeIcon: StarActiveIcon,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: ProfileIcon,
    activeIcon: ProfileActiveIcon,
  },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? item.activeIcon : item.icon}
                alt=""
                className="bottom-nav__icon"
              />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
