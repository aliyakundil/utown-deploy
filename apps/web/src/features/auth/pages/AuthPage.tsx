// import { Link } from "react-router-dom";

import "./AuthPage.css";

import logoWhite from "../../../assets/images/Logo-white.svg";
import Button from "../../../components/ui/Button/Button";

export default function AuthPage() {
  return (
    <main className="auth-page">
      <section className="auth">
        <img
          src={logoWhite}
          alt="UTOWN"
          className="auth__logo"
        />

        <div className="auth__actions">
          <Button
            to="/login"
            variant="secondary"
          >
            Log in
          </Button>

          {/* <Link
            to="/register"
            className="auth__button"
          >
            Register
          </Link> */}
          <Button
            to="/register"
            variant="secondary"
          >
            Register
          </Button>
        </div>
      </section>
    </main>
  );
}