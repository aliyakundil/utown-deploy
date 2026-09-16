import "./LoginPage.css";

import Logo from "../../../components/ui/Logo/Logo";
import LoginForm from "../components/LoginForm";
import BackButton from "../../../components/ui/BackButton/BackButton.tsx";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login">
        
        <BackButton to="/auth" />

        <div className="login__logo">
        <Logo />
      </div>

      <LoginForm />

        {/* <div className="login__register">
          <p>
            To register an establishment,
            <br />
            call the number:
          </p>

          <a href="tel:01012345678">
            010 1234 56 78
          </a>
        </div> */}

      </section>
    </main>
  );
}