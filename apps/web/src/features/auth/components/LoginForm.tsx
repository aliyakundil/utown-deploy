import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/auth.api";
import type { ApiErrorResponse } from "../types/auth.types";

import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";

import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrors({
      phone: "",
      password: "",
      general: "",
    });

    try {
      const response = await login({
        phone,
        password,
      });

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refreshToken
      );

      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message =
          error.response?.data.error ?? "Something went wrong";

        if (
          message === "Phone is required" ||
          message === "Invalid phone number format"
        ) {
          setErrors({
            phone: message,
            password: "",
            general: "",
          });

          return;
        }

        if (message === "Password is required") {
          setErrors({
            phone: "",
            password: message,
            general: "",
          });

          return;
        }

        setErrors({
          phone: "",
          password: "",
          general: message,
        });
      }
    }
  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          color: errors.phone
            ? "var(--color-error)"
            : undefined,
        }}
      />

      {errors.phone && (
        <p className="login-form__error">
          {errors.phone}
        </p>
      )}

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          color: errors.password
            ? "var(--color-error)"
            : undefined,
        }}
      />

      {errors.password && (
        <p className="login-form__error">
          {errors.password}
        </p>
      )}

      <Button type="submit">
        Log in
      </Button>

      {errors.general && (
        <p className="login-form__error">
          {errors.general}
        </p>
      )}

      <button
        type="button"
        className="login-form__recover"
      >
        Forgot your password? Recover it
      </button>
    </form>
  );
}