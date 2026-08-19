import { useLocation } from "react-router-dom";
import VerificationCodeForm from "../components/VerificationCodeForm";
import BackButton from "../../../components/ui/BackButton/BackButton.tsx";

export default function VerificationCodePage() {
  const location = useLocation();
  const backTo = location.state?.mode === "reset" ? "/recover-password" : "/register";

  return (
    <main className="verification-page">
      <section className="verification">
        <BackButton to={backTo} />
        <VerificationCodeForm />
      </section>
    </main>
  );
}
