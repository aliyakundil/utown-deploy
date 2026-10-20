import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { forgotPassword } from "../api/auth.api";

import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";

export default function RecoverPasswordForm() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    const isEmail = identifier.includes("@");

    try {
      await forgotPassword(
        isEmail ? { email: identifier } : { phone: identifier }
      );

      navigate("/verify-code", {
        state: { identifier, isEmail, mode: "reset" },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ?? "Something went wrong"
        );
      }
    }
  };

  return (
    <form className="recover-form" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Phone number or email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      {error && <p className="recover-form__error">{error}</p>}

      <Button type="submit">Reset password</Button>
    </form>
  );
}
