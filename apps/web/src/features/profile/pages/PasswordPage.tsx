import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./ProfileForm.css";

import BackButton from "../../../components/ui/BackButton/BackButton";
import { changePassword } from "../api/profile.api";

import Logo from "../../../assets/images/Vector.svg";

export default function PasswordPage() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (newPassword !== repeatPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsSaving(true);

    try {
      const res = await changePassword({ newPassword });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/profile/account");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't change your password");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="profile-form-page">
      <header className="profile-form-header">
        <BackButton to="/profile/account" />

        <div className="profile-form-header__logo">
          <img src={Logo} alt="UTOWN" />
        </div>
      </header>

      <h1 className="profile-form-title">Password</h1>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="profile-form__label" htmlFor="newPassword">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          className="profile-form__input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />

        <label className="profile-form__label" htmlFor="repeatPassword">
          Repeat Password
        </label>
        <input
          id="repeatPassword"
          type="password"
          className="profile-form__input"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Repeat new password"
        />

        {error && <p className="profile-form__error">{error}</p>}

        <button type="submit" className="profile-form__save" disabled={isSaving}>
          Save
        </button>
      </form>
    </main>
  );
}
