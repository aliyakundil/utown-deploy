import { Link, NavLink } from "react-router-dom";

import "./AdminSidebar.css";

import Logo from "../../../assets/images/Logo.svg";

interface AdminNavItem {
  label: string;
  to: string | null;
}

interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

const groups: AdminNavGroup[] = [
  {
    label: "Users",
    items: [
      { to: "/admin/users", label: "Clients" },
      { to: null, label: "Riders" },
      { to: "/admin/restaurants", label: "Establishments" },
      { to: "/admin/orders", label: "Orders" },
    ],
  },
  {
    label: "App",
    items: [
      { to: null, label: "Services" },
      { to: null, label: "Vacancies" },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link to="/admin/users" className="admin-sidebar__logo">
        <img src={Logo} alt="UTOWN" />
        <span>OWN</span>
      </Link>

      <nav className="admin-sidebar__nav">
        {groups.map((group) => (
          <div key={group.label} className="admin-sidebar__group">
            <span className="admin-sidebar__group-label">{group.label}</span>

            {group.items.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `admin-sidebar__item ${
                      isActive ? "admin-sidebar__item--active" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <span
                  key={item.label}
                  className="admin-sidebar__item admin-sidebar__item--disabled"
                >
                  {item.label}
                </span>
              )
            )}
          </div>
        ))}
      </nav>

      <button
        type="button"
        className="admin-sidebar__settings"
        aria-label="Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 15a3 3 0 100-6 3 3 0 000 6z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </button>
    </aside>
  );
}
