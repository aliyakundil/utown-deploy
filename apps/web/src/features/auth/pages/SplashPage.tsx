import "./SplashPage.css";

// import Logo from "../../../components/ui/Logo/Logo";
import logoWhite from "../../../assets/images/Logo-white.svg";

export default function SplashPage() {
  return (
    <main className="splash">
      <img
        src={logoWhite}
        alt="UTOWN"
        className="splash__logo"
      />
    </main>
  );
}