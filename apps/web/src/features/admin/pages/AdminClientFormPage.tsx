import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./AdminClientFormPage.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import { getMyProfile } from "../../profile/api/profile.api";
import { getUserById, createClient, updateClient } from "../api/admin.api";

type LoadState = "loading" | "forbidden" | "ready";

export default function AdminClientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [state, setState] = useState<LoadState>("loading");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        if (!isEditing) {
          setState("ready");
          return;
        }

        return getUserById(Number(id)).then((res) => {
          setName(res.data.name);
          setPhone(res.data.phone);
          setAddress(res.data.address ?? "");
          setState("ready");
        });
      })
      .catch(() => setState("forbidden"));
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        await updateClient(Number(id), {
          username: name.trim(),
          phone: phone.trim(),
          address: address.trim() || undefined,
        });
      } else {
        await createClient({
          username: name.trim(),
          phone: phone.trim(),
          address: address.trim() || undefined,
        });
      }

      navigate("/admin/users");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Couldn't save the client");
      }
    } finally {
      setIsSaving(false);
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
          <p className="admin-breadcrumb">
            Home / Users / Clients / {isEditing ? "Edit" : "Add"}
          </p>

          <h1 className="admin-form-title">
            {isEditing ? "Edit client" : "Add new client"}
          </h1>

          {state === "loading" && (
            <p className="admin-message">Loading...</p>
          )}

          {state === "ready" && (
            <form className="admin-client-form" onSubmit={handleSubmit}>
              <div className="admin-client-form__image">
                <span>↑</span>
              </div>

              <label className="admin-client-form__label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="admin-client-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />

              <label className="admin-client-form__label" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                className="admin-client-form__input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter number"
              />

              <label className="admin-client-form__label" htmlFor="address">
                Delivery address
              </label>
              <input
                id="address"
                className="admin-client-form__input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
              />

              {error && <p className="admin-error">{error}</p>}

              <div className="admin-client-form__actions">
                <button
                  type="button"
                  className="admin-client-form__cancel"
                  onClick={() => navigate("/admin/users")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-client-form__save"
                  disabled={isSaving}
                >
                  {isEditing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
