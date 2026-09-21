import "./NewPasswordPage.css";

import NewPasswordForm from "../components/NewPasswordForm";
import BackButton from "../../../components/ui/BackButton/BackButton.tsx";

export default function NewPasswordPage() {
  return (
    <main className="new-password-page">
      <section className="new-password">
        <BackButton to="/recover-password" />

        <h1 className="new-password__title">New password</h1>

        <p className="new-password__subtitle">
          Enter a new password to access your account
        </p>

        <NewPasswordForm />
      </section>
    </main>
  );
}
