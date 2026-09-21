import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./ProfileForm.css";

import BackButton from "../../../components/ui/BackButton/BackButton";
import { getMyProfile, updateProfile } from "../api/profile.api";

import Logo from "../../../assets/images/Vector.svg";

export default function PersonalInformationPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setName(res.data.name);
        setPhone(res.data.phone);
        setAddress(res.data.address ?? "");
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      setSuccess("Saved");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save your information");
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

      <h1 className="profile-form-title">Personal Information</h1>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="profile-form__label" htmlFor="name">
          Your Name
        </label>
        <input
          id="name"
          className="profile-form__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <label className="profile-form__label" htmlFor="phone">
          Your Phone Number
        </label>
        <input
          id="phone"
          className="profile-form__input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
        />

        <label className="profile-form__label" htmlFor="address">
          Your Address (for delivery)
        </label>
        <input
          id="address"
          className="profile-form__input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />

        {error && <p className="profile-form__error">{error}</p>}
        {success && <p className="profile-form__success">{success}</p>}

        <button type="submit" className="profile-form__save" disabled={isSaving}>
          Save
        </button>
      </form>
    </main>
  );
}
