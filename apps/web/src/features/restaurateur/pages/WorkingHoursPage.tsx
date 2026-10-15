import { Link, useNavigate } from "react-router-dom";

import "./WorkingHoursPage.css";

import BusinessSidebar from "../components/BusinessSidebar";
import BusinessTopBar from "../components/BusinessTopBar";
import { useSidebar } from "../../../components/layout/Sidebar/SidebarContext";
import { useMyRestaurant } from "../context/RestaurantContext";
import { DAYS } from "../../restaurants/constants/establishment";

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
        <BusinessTopBar onOpenMenu={open} />

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
