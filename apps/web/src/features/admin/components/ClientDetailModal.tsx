import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ClientDetailModal.css";

import { getUserById, deleteUser } from "../api/admin.api";
import type { AdminUser } from "../types/admin.types";

interface ClientDetailModalProps {
  userId: number;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ClientDetailModal({
  userId,
  onClose,
  onDeleted,
}: ClientDetailModalProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserById(userId)
      .then((res) => setUser(res.data))
      .catch(() => setError("Couldn't load this client"));
  }, [userId]);

  const handleDelete = async () => {
    try {
      await deleteUser(userId);
      onDeleted();
    } catch {
      setError("Couldn't delete this client");
    }
  };

  return (
    <div className="client-modal-overlay" onClick={onClose}>
      <div className="client-modal" onClick={(e) => e.stopPropagation()}>
        {isConfirmingDelete ? (
          <div className="client-modal__confirm">
            <p className="client-modal__confirm-title">Delete client?</p>

            <button
              type="button"
              className="client-modal__confirm-delete"
              onClick={handleDelete}
            >
              Delete
            </button>

            <button
              type="button"
              className="client-modal__confirm-cancel"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="client-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>

            {error && <p className="client-modal__error">{error}</p>}

            {!user && !error && (
              <p className="client-modal__loading">Loading...</p>
            )}

            {user && (
              <>
                <div className="client-modal__header">
                  <div className="client-modal__avatar">
                    {user.name ? user.name[0].toUpperCase() : "?"}
                  </div>

                  <button
                    type="button"
                    className="client-modal__edit-link"
                    onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                  >
                    Edit account →
                  </button>
                </div>

                <p className="client-modal__name">
                  {user.name || "(no name)"}
                </p>

                <div className="client-modal__row">
                  <span>Phone</span>
                  <span>{user.phone}</span>
                </div>

                <div className="client-modal__row">
                  <span>City</span>
                  <span>{user.city || "—"}</span>
                </div>

                <div className="client-modal__row">
                  <span>Address</span>
                  <span>{user.address || "—"}</span>
                </div>

                <div className="client-modal__row">
                  <span>Role</span>
                  <span>{user.role}</span>
                </div>

                <button
                  type="button"
                  className="client-modal__delete"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  Delete client
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
