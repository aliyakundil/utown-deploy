import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./AdminPages.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import { sendSystemNotification } from "../api/admin.api";

type LoadState = "loading" | "forbidden" | "ready";

export default function AdminNotificationsPage() {
  const navigate = useNavigate();

  const [state, setState] = useState<LoadState>("loading");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        setState("ready");
      })
      .catch(() => setState("forbidden"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Title and message are required");
      return;
    }

    setIsSending(true);

    try {
      const result = await sendSystemNotification({
        title: title.trim(),
        message: message.trim(),
        userId: userId ? Number(userId) : undefined,
      });

      setSuccess(
        userId
          ? "Notification sent to the user"
          : `Notification sent to ${result.data.count} users`
      );
      setTitle("");
      setMessage("");
      setUserId("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't send the notification");
      }
    } finally {
      setIsSending(false);
    }
  };

  if (state === "forbidden") {
    return (
      <>
        <AdminSidebar />
        <main className="admin-page">
          <AdminTopBar />
          <div className="admin-content">
            <p className="admin-message">
              This page is only available to administrators.
            </p>
            <button
              type="button"
              className="admin-home-button"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />

      <main className="admin-page">
        <AdminTopBar />

        <div className="admin-content">
          <p className="admin-breadcrumb">Home / Notifications</p>

          <h1 className="admin-form-title">Send notification</h1>

          {state === "loading" && <p className="admin-message">Loading...</p>}

          {state === "ready" && (
            <form className="admin-client-form" onSubmit={handleSubmit}>
              <label className="admin-client-form__label" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="admin-client-form__input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Maintenance notice"
              />

              <label className="admin-client-form__label" htmlFor="message">
                Message
              </label>
              <input
                id="message"
                className="admin-client-form__input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="The platform will be down for maintenance tonight at 2 AM."
              />

              <label className="admin-client-form__label" htmlFor="userId">
                User ID (optional — leave blank to send to everyone)
              </label>
              <input
                id="userId"
                type="number"
                className="admin-client-form__input"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Leave blank for broadcast"
              />

              {error && <p className="admin-error">{error}</p>}
              {success && <p className="admin-success">{success}</p>}

              <div className="admin-client-form__actions">
                <button
                  type="submit"
                  className="admin-client-form__save"
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : userId ? "Send to user" : "Send to everyone"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}