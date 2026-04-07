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
    <section className="auth-shell">
      <form className="card auth-card" onSubmit={submitHandler}>
        <h1>Edit User</h1>

        {error && <div className="message message--error">{error}</div>}

        <label className="field">
          <span>Name</span>
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </label>

        <label className="radio-field">
          <input
            type="checkbox"
            checked={user.isAdmin}
            onChange={(e) => setUser({ ...user, isAdmin: e.target.checked })}
          />
          Admin Access
        </label>

        {user.isAdmin && (
          <label className="field">
            <span>Admin Secret Key</span>
            <input
              type="password"
              value={adminSecretKey}
              onChange={(e) => setAdminSecretKey(e.target.value)}
              placeholder="Required only when promoting to admin"
            />
          </label>
        )}

        <button className="button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update User"}
        </button>
      </form>
    </section>
  );
};

export default AdminUserEdit;
