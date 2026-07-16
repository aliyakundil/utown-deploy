import { useState } from "react";
import Button from "../../../components/ui/Button/Button";
import OTPInput from "../../../components/ui/OTPInput/OTPInput";

import "./VerificationCodeForm.css";

export default function VerificationCodeForm() {
  const [code, setCode] = useState(["", "", "", ""]);
  <OTPInput
    value={code}
    onChange={setCode}
  />

  return (
    <form className="verification-form">

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