import { useState } from "react";
import Button from "../../../components/ui/Button/Button";
import OTPInput from "../../../components/ui/OTPInput/OTPInput";

import "./VerificationCodeForm.css";

import { useLocation, useNavigate } from "react-router-dom";
import { verifyCode } from "../api/auth.api";
import axios from "axios";

export default function VerificationCodeForm() {
  const [code, setCode] = useState(["", "", "", ""]);

  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone ?? "";
  const mode = location.state?.mode ?? "register";

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (mode === "reset") {
      navigate("/new-password", {
        state: { phone, code: code.join("") },
      });
      return;
    }

    try {
      const response = await verifyCode({
        phone,
        code: code.join(""),
      });

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
      }
    }
  };

  return (
    <form
      className="verification-form"
      onSubmit={handleSubmit}
    >

      <h1 className="verification-form__title">
        Verification Code
      </h1>

      <p className="verification-form__subtitle">
        Enter the verification code sent via SMS
      </p>

      <OTPInput
        value={code}
        onChange={setCode}
      />

      <p className="verification-form__timer">
        02:39
      </p>

      <button
        type="button"
        className="verification-form__retry"
      >
        Didn't receive the code? Try again
      </button>

      <Button type="submit">
        Confirm
      </Button>

    </form>
  );
}