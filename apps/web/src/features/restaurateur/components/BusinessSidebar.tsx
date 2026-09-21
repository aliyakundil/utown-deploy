import { Link, NavLink } from "react-router-dom";

import "../../../components/layout/Sidebar/Sidebar.css";

import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";

import Logo from "../../../assets/images/Logo.svg";

const chevron = (
  <svg
    className="sidebar__chevron"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const items = [
  { to: "/business/orders", label: "Order table" },
  { to: null, label: "Notifications" },
  { to: "/business/statistics", label: "Statistics" },
  { to: "/business/menu", label: "Menu" },
  { to: "/business/establishment", label: "Establishment" },
  { to: null, label: "Working hours" },
];

export default function BusinessSidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <Link to="/business/orders" className="sidebar__logo" onClick={close}>
          <img src={Logo} alt="UTOWN BUSINESS" />
        </Link>

        <nav className="sidebar__nav">
          {items.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
                }
                onClick={close}
              >
                <span>{item.label}</span>
                {chevron}
              </NavLink>
            ) : (
              <div key={item.label} className="sidebar__item">
                <span>{item.label}</span>
                {chevron}
              </div>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
