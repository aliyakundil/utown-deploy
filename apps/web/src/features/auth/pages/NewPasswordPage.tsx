import Logo from "../../../components/ui/Logo/Logo";
import NewPasswordForm from "../components/NewPasswordForm";

export default function NewPasswordPage() {
  return (
    <main className="new-password-page">
      <section className="new-password">
        <div className="new-password__logo">
          <Logo />
        </div>

        <NewPasswordForm />
      </section>
    </main>
  );
}
