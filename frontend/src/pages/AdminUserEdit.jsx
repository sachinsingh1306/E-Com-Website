import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import API from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setUser(data);
        setError("");
      } catch (error) {
        setError(getErrorMessage(error, "Unable to load user"));
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await API.put(`/users/${id}`, {
        ...user,
        adminSecretKey,
      });
      navigate("/admin/users");
    } catch (error) {
      setError(getErrorMessage(error, "Unable to update user"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Loading user..." />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
            Edit User
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Update user details and control admin access securely.
          </p>
        </div>

        <form
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          onSubmit={submitHandler}
        >
          <div className="grid gap-6">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </span>
              <input
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={user.isAdmin}
                  onChange={(e) =>
                    setUser({ ...user, isAdmin: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <p className="font-semibold text-slate-900">Admin Access</p>
                  <p className="text-sm text-slate-500">
                    Grant full dashboard control to this user.
                  </p>
                </div>
              </label>
            </div>

            {user.isAdmin && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Admin Secret Key
                </span>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  placeholder="Required only when promoting to admin"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Enter the secret key only when converting a normal user into an admin.
                </p>
              </label>
            )}

            <div className="flex gap-3 pt-2">
              <button
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update User"}
              </button>

              <button
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                type="button"
                onClick={() => navigate("/admin/users")}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminUserEdit;
