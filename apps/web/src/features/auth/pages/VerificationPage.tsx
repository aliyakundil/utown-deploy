import VerificationCodeForm from "../components/VerificationCodeForm";
import BackButton from "../../../components/ui/BackButton/BackButton.tsx";

export default function VerificationCodePage() {
  return (
    <main className="verification-page">
      <section className="verification">
        <BackButton to="/register" />

        <VerificationCodeForm />
      </section>
    </main>
  );
}