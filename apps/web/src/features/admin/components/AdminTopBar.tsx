import { useNavigate } from "react-router-dom";

import "./AdminTopBar.css";

export default function AdminTopBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <header className="admin-topbar">
      <button
        type="button"
        className="admin-topbar__admin-button"
        onClick={handleLogout}
        title="Log out"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M4 20c1.6-3.6 5-6 8-6s6.4 2.4 8 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Admin
      </button>
    </header>
  );
}
