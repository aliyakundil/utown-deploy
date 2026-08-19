import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { resetPassword } from "../api/auth.api";

import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";

export default function NewPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone ?? "";
  const code = location.state?.code ?? "";

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ phone, code, newPassword: password });

      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ?? "Something went wrong"
        );
      }
    }
  };

  return (
    <form className="new-password-form" onSubmit={handleSubmit}>
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Repeat the password again"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />

      {error && <p className="new-password-form__error">{error}</p>}

      <Button type="submit">Log in</Button>
    </form>
  );
}
