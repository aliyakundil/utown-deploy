import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProfileSubpage.css";

import BackButton from "../../../components/ui/BackButton/BackButton";
import NotificationBell from "../../../components/ui/NotificationBell/NotificationBell";
import { getMyProfile, deleteProfile, updateProfile } from "../api/profile.api";
import { disconnectSocket } from "../../../lib/socket";
import { uploadImage, resolveUploadUrl } from "../../../lib/upload";

import Logo from "../../../assets/images/Vector.svg";
import UserIcon from "../../../assets/images/user.svg";

export default function AccountSettingsPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setName(res.data.name);
        setImageUrl(res.data.imageUrl);
      })
      .catch(() => setName(""));
  }, []);

  
  
  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError("");
    setIsUploadingAvatar(true);

    try {
      const uploaded = await uploadImage(file);
      const url = uploaded.data.url;

      if (!url) {
        throw new Error("Uploaded image URL is missing");
      }

      await updateProfile({ imageUrl: url });
      setImageUrl(url);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      setError("Couldn't upload the photo");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");

    try {
      await deleteProfile();
      localStorage.removeItem("accessToken");
      disconnectSocket();
      navigate("/login");
    } catch {
      setError("Couldn't delete your account");
    }
  };

  return (
    <main className="profile-sub-page">
      <header className="profile-sub-header">
        <BackButton to="/profile" />

        <div className="profile-sub-header__logo">
          <img src={Logo} alt="UTOWN" />
        </div>

        <button
          type="button"
          className="profile-sub-header__bell"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <NotificationBell />
        </button>
      </header>

      <h1 className="profile-sub-title">Account Settings</h1>

      <div className="profile-sub-content">
        <div className="profile-sub-avatar-row">
          <div className="profile-sub-avatar-wrap">
            <label htmlFor="avatar-upload" className="profile-sub-avatar">
              {imageUrl ? (
                <img
                  src={resolveUploadUrl(imageUrl)}
                  alt=""
                  className="profile-sub-avatar__photo"
                />
              ) : (
                <img src={UserIcon} alt="" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="profile-sub-avatar-input"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
            />
            <label htmlFor="avatar-upload" className="profile-sub-avatar-change">
              {isUploadingAvatar ? "Uploading..." : "Change photo"}
            </label>
          </div>
          <span className="profile-sub-name">{name || "User"}</span>
        </div>

        <ul className="profile-sub-list">
          <li className="profile-sub-list__item">
            <button
              type="button"
              className="profile-sub-list__link"
              onClick={() => navigate("/profile/personal-information")}
            >
              Edit Personal Information
              <span className="profile-sub-list__chevron">›</span>
            </button>
          </li>
          <li className="profile-sub-list__item">
            <button
              type="button"
              className="profile-sub-list__link"
              onClick={() => navigate("/profile/password")}
            >
              Password
              <span className="profile-sub-list__chevron">›</span>
            </button>
          </li>
        </ul>

        {error && <p className="profile-sub-error">{error}</p>}

        {isConfirmingDelete ? (
          <button
            type="button"
            className="profile-sub-delete"
            onClick={handleDeleteAccount}
          >
            Confirm delete — this can't be undone
          </button>
        ) : (
          <button
            type="button"
            className="profile-sub-delete"
            onClick={() => setIsConfirmingDelete(true)}
          >
            Delete Account
          </button>
        )}
      </div>
    </main>
  );
}
