import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminPages.css";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import ClientDetailModal from "../components/ClientDetailModal";
import { getMyProfile } from "../../profile/api/profile.api";
import { getAllUsers, updateUserRole, deleteUser } from "../api/admin.api";
import type { AdminUser, UserRole } from "../types/admin.types";

const ROLE_OPTIONS: UserRole[] = ["CLIENT", "RESTAURATEUR", "ADMIN"];

type LoadState = "loading" | "forbidden" | "ready";

export default function AdminUsersPage() {
  const navigate = useNavigate();

  const [state, setState] = useState<LoadState>("loading");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          setState("forbidden");
          return;
        }

        return loadUsers(1, "");
      })
      .catch(() => setState("forbidden"));
  }, []);

  function loadUsers(nextPage: number, nextSearch: string) {
    return getAllUsers(nextPage, nextSearch)
      .then((res) => {
        setUsers(res.data.users);
        setPage(res.data.meta.page);
        setTotalPages(res.data.meta.totalPage);
        setState("ready");
      })
      .catch(() => setState("forbidden"));
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(1, search);
  };

  const handleRoleChange = async (userId: number, role: UserRole) => {
    setError("");

    try {
      await updateUserRole(userId, role);
      await loadUsers(page, search);
    } catch {
      setError("Couldn't update the user's role");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Delete this user permanently?")) return;

    setError("");

    try {
      await deleteUser(userId);
      await loadUsers(page, search);
    } catch {
      setError("Couldn't delete the user");
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
          <p className="admin-breadcrumb">Home / Users / Clients</p>

          <div className="admin-page-head">
            <h1>Clients</h1>

            <div className="admin-page-controls">
              <form onSubmit={handleSearchSubmit} className="admin-page-controls">
                <input
                  className="admin-search"
                  placeholder="Search by name or phone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="admin-search-button">
                  Search
                </button>
              </form>

              <button
                type="button"
                className="admin-add-button"
                onClick={() => navigate("/admin/users/new")}
              >
                + Add
              </button>
            </div>
          </div>

          {error && <p className="admin-error">{error}</p>}

          {state === "loading" && (
            <p className="admin-message">Loading...</p>
          )}

          {state === "ready" && (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Verified</th>
                      <th>Role</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="admin-table__row-clickable"
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <td className="admin-table__name">
                          {user.name || "(no name)"}
                        </td>
                        <td>{user.phone}</td>
                        <td className="admin-table__muted">
                          {user.city || "—"}
                        </td>
                        <td className="admin-table__muted">
                          {user.isVerified ? "Yes" : "No"}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select
                            className="admin-table__select"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value as UserRole
                              )
                            }
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="admin-table__link"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => loadUsers(page - 1, search)}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      className={
                        p === page ? "admin-pagination__active" : ""
                      }
                      onClick={() => loadUsers(p, search)}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => loadUsers(page + 1, search)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {selectedUserId && (
        <ClientDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onDeleted={() => {
            setSelectedUserId(null);
            loadUsers(page, search);
          }}
        />
      )}
    </>
  );
}
