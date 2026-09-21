import "./RecoverPasswordPage.css";

import RecoverPasswordForm from "../components/RecoverPasswordForm";
import BackButton from "../../../components/ui/BackButton/BackButton.tsx";

export default function RecoverPasswordPage() {
  return (
    <main className="recover-page">
      <section className="recover">
        <BackButton to="/login" />

        <h1 className="recover__title">Recover password</h1>

        <p className="recover__subtitle">
          Enter the phone number you registered earlier
        </p>

        <RecoverPasswordForm />
      </section>
    </main>
  );
}
