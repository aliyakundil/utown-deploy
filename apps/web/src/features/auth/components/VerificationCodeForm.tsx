import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button/Button";
import OTPInput from "../../../components/ui/OTPInput/OTPInput";
import SuccessModal from "./SuccessModal";

import "./VerificationCodeForm.css";

import { useLocation, useNavigate } from "react-router-dom";
import { verifyCode, resendCode, forgotPassword } from "../api/auth.api";
import { connectSocket } from "../../../lib/socket";
import axios from "axios";

const CODE_TTL_SECONDS = 159;

export default function VerificationCodeForm() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CODE_TTL_SECONDS);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone ?? "";
  const mode = location.state?.mode ?? "register";

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const submitCode = async () => {
    if (isSubmitting) return;

    setError("");

    if (mode === "reset") {
      setIsCodeConfirmed(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await verifyCode({
        phone,
        code: code.join(""),
      });

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refreshToken
      );

      connectSocket();

      setIsRegisterSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ?? "Invalid verification code"
        );
      }

      setCode(["", "", "", ""]);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      submitCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    submitCode();
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    setError("");
    setCode(["", "", "", ""]);

    try {
      if (mode === "reset") {
        await forgotPassword({ phone });
      } else {
        await resendCode({ phone });
      }

      setSecondsLeft(CODE_TTL_SECONDS);
    } catch {
      setError("Couldn't resend the code, try again later");
    }
  };

  const minutes = String(
    Math.floor(secondsLeft / 60)
  ).padStart(2, "0");

  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <>
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

        {error && (
          <p className="verification-form__error">{error}</p>
        )}

        <p className="verification-form__timer">
          {minutes}:{seconds}
        </p>

        <button
          type="button"
          className="verification-form__retry"
          disabled={secondsLeft > 0}
          onClick={handleResend}
        >
          {secondsLeft > 0
            ? "Didn't receive the code? Try again"
            : "Send a new code"}
        </button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Confirm
        </Button>

      </form>

      {isCodeConfirmed && (
        <SuccessModal
          title="Password successfully reset"
          subtitle="You can now log in with your new password"
          onConfirm={() =>
            navigate("/new-password", {
              state: { phone, code: code.join("") },
            })
          }
        />
      )}

      {isRegisterSuccess && (
        <SuccessModal
          title="Registration was successful"
          subtitle="You can now fully enjoy all the features"
          buttonLabel="Close"
          onConfirm={() => navigate("/home")}
        />
      )}
    </>
  );
}
