import Logo from "../../../components/ui/Logo/Logo";
import RecoverPasswordForm from "../components/RecoverPasswordForm";
import BackButton from "../../../components/ui/BackButton/BackButton.tsx";

export default function RecoverPasswordPage() {
  return (
    <main className="recover-page">
      <section className="recover">
        <BackButton to="/login" />

        <div className="recover__logo">
          <Logo />
        </div>

        <RecoverPasswordForm />
      </section>
    </main>
  );
}
