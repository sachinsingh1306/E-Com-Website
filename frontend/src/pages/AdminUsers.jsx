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
    <section className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Users</h1>
        </div>
      </div>

      {error && <div className="message message--error">{error}</div>}

      {loading ? (
        <Loader message="Loading users..." />
      ) : (
        <div className="stack">
          {users.map((user) => (
            <div key={user._id} className="order-row card">
              <div>
                <p>{user.name}</p>
                <p className="muted">{user.email}</p>
                <p className="muted">{user.isAdmin ? "Admin" : "Customer"}</p>
              </div>

              <div className="inline-actions">
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="button button--ghost"
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
    </section>
  );
};

export default AdminUsers;
