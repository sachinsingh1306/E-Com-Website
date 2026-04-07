import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import API from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data || []);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await API.delete(`/users/${id}`);
      await fetchUsers();
    } catch (error) {
      setError(getErrorMessage(error, "Unable to delete user"));
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage customer accounts and securely control admin access.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <Loader message="Loading users..." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-lg font-bold text-white shadow-md">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.isAdmin
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "Customer"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="break-all text-xs text-slate-400">{user._id}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    type="button"
                    onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="flex-1 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    type="button"
                    onClick={() => deleteHandler(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
