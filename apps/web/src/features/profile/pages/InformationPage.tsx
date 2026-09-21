import { useNavigate } from "react-router-dom";

import "./ProfileSubpage.css";

import BackButton from "../../../components/ui/BackButton/BackButton";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";

import Logo from "../../../assets/images/Vector.svg";

const INFO_ITEMS = ["Privacy Policy", "Terms of Use", "Disclaimer"];

export default function InformationPage() {
  const navigate = useNavigate();

  return (
    <main className="profile-sub-page">
      <header className="profile-sub-header">
        <BackButton to="/profile" />

        <div className="profile-sub-header__logo">
          <img src={Logo} alt="UTOWN" />
        </div>

        <button
          type="button"
          className="profile-sub-header__bell"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <NotificationBell />
        </button>
      </header>

      <h1 className="profile-sub-title">Information</h1>

      <div className="profile-sub-content">
        <ul className="profile-sub-list">
          {INFO_ITEMS.map((label) => (
            <li key={label} className="profile-sub-list__item">
              <button type="button" className="profile-sub-list__link" disabled>
                {label}
                <span className="profile-sub-list__chevron">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
