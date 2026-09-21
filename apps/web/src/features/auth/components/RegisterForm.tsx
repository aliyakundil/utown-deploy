import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../api/auth.api";
import type { ApiErrorResponse } from "../types/auth.types";

import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";

import CallIcon from "../../../assets/images/call.svg";
import LockIcon from "../../../assets/images/lock.svg";
import EyeIcon from "../../../assets/images/eye.svg";
import EyeOffIcon from "../../../assets/images/eye-off.svg";

import "./RegisterForm.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    repeatPassword: "",
    general: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrors({
      phone: "",
      password: "",
      repeatPassword: "",
      general: "",
    });

    if (password !== repeatPassword) {
      setErrors({
        phone: "",
        password: "",
        repeatPassword: "Passwords do not match",
        general: "",
      });

      return;
    }

    try {
      const response = await register({
        phone,
        password,
      });

      console.log(response);

      navigate("/verify-code", {
        state: {
          phone,
        },
      });

    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message =
          error.response?.data.error ??
          "Something went wrong";
        const field = error.response?.data.field ?? "general";

        setErrors({
          phone: field === "phone" ? message : "",
          password: field === "password" ? message : "",
          repeatPassword: "",
          general: field === "general" ? message : "",
        });
      }
    }
  };

  return (
    <form
      className="register-form"
      onSubmit={handleSubmit}
    >
      <h1 className="register-form__title">
        User Registration
      </h1>

      <p className="register-form__subtitle">
        Register to access all the benefits of the app
      </p>

      <label className="register-form__label">
        Phone Number
      </label>

      <div className="register-form__input">
        <img
          src={CallIcon}
          alt=""
          className="register-form__icon"
        />

        <Input
          type="tel"
          placeholder="Enter your phone number without dashes"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      {errors.phone && (
        <p className="register-form__error">
          {errors.phone}
        </p>
      )}

      <label className="register-form__label">
        Password
      </label>

      <div className="register-form__input">
        <img
          src={LockIcon}
          alt=""
          className="register-form__icon"
        />

        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <img
          src={showPassword ? EyeOffIcon : EyeIcon}
          alt=""
          className="register-form__eye"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>

      {errors.password && (
        <p className="register-form__error">
          {errors.password}
        </p>
      )}

      <div className="register-form__input">
        <img
          src={LockIcon}
          alt=""
          className="register-form__icon"
        />

        <Input
          type={showRepeatPassword ? "text" : "password"}
          placeholder="Repeat your password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />

        <img
          src={showRepeatPassword ? EyeOffIcon : EyeIcon}
          alt=""
          className="register-form__eye"
          onClick={() =>
            setShowRepeatPassword(!showRepeatPassword)
          }
        />
      </div>

      {errors.repeatPassword && (
        <p className="register-form__error">
          {errors.repeatPassword}
        </p>
      )}

      <Button type="submit">
        Get Code
      </Button>

      {errors.general && (
        <p className="register-form__error">
          {errors.general}
        </p>
      )}

      <button
        type="button"
        className="register-form__login"
      >
        Already have an account?
      </button>

      <p className="register-form__terms">
        By registering, you agree to the Terms of Service and
        Privacy Policy, as well as the Cookie Policy.
      </p>
    </form>
  );
}