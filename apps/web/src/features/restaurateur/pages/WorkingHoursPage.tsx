import { Link, useNavigate } from "react-router-dom";

import "./WorkingHoursPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { DAYS } from "../../restaurants/constants/establishment";

import LogoBusiness from "../../../assets/images/LogoBusiness.svg";

export default function WorkingHoursPage() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { state: restaurantState, restaurant } = useMyRestaurant();

  if (restaurantState === "loading" || restaurantState === "idle") {
    return (
      <>
        <BusinessSidebar />
        <main className="working-hours-page">
          <p className="working-hours-message">Loading...</p>
        </main>
      </>
    );
  }

  if (restaurantState === "forbidden") {
    return (
      <>
        <BusinessSidebar />
        <main className="working-hours-page">
          <p className="working-hours-message">
            This page is only available to restaurant owners.
          </p>
          <button
            type="button"
            className="working-hours-day__save"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </main>
      </>
    );
  }

  if (!restaurant) {
    return (
      <>
        <BusinessSidebar />
        <main className="working-hours-page">
          <p className="working-hours-message">
            You don't have a restaurant yet.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <BusinessSidebar />

      <main className="working-hours-page">
        <div className="working-hours-topbar">
          <button
            type="button"
            className="working-hours-hamburger"
            aria-label="Open menu"
            onClick={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <img src={LogoBusiness} alt="UT.BUSINESS" className="working-hours-logo" />
        </div>

        <h1 className="working-hours-title">Opening hours of the establishment</h1>

        <div className="working-hours-list">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="working-hours-row">
              <span className="working-hours-row__day">{label}</span>

              <Link
                to={`/business/establishment/hours/${key}`}
                className="working-hours-row__edit"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
