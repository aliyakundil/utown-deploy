import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashPage.css";

import logoWhite from "../../../assets/images/Logo-white.svg";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasToken = localStorage.getItem("accessToken");
      navigate(hasToken ? "/home" : "/auth", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash">
      <img src={logoWhite} alt="UTOWN" className="splash__logo" />
    </main>
  );
}