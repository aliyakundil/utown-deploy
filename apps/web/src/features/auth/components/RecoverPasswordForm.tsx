import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./RecoverPasswordForm.css";

import { forgotPassword } from "../api/auth.api";

import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import phoneIcon from "../../../assets/images/call.svg";

export default function RecoverPasswordForm() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    try {
      await forgotPassword({ phone });

      navigate("/verify-code", {
        state: { phone, mode: "reset" },
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
      <label
        className="recover-form__label"
        htmlFor="recover-phone"
      >
        Phone number
      </label>

      <Input
        id="recover-phone"
        type="text"
        placeholder="Phone number"
        icon={<img src={phoneIcon} alt="" />}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {error && <p className="recover-form__error">{error}</p>}

      <Button type="submit">Reset password</Button>
    </form>
  );
}
