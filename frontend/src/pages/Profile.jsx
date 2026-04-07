import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import API from "../services/api";
import { formatCurrency, getErrorMessage } from "../utils/helpers";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const { data: userData } = await API.get("/users/profile");
        const { data: orderData } = await API.get("/orders/myorders");

        if (!ignore) {
          setUser(userData);
          setOrders(orderData);
          setError("");
        }
      } catch (error) {
        if (!ignore) {
          setError(getErrorMessage(error, "Unable to load your profile"));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <Loader message="Loading profile..." />;
  }

  if (error) {
    return <div className="message message--error">{error}</div>;
  }

  if (!user) {
    return <div className="message">Profile not found.</div>;
  }

  return (
    <section className="content-grid">
      <div className="card card--stack">
        <h1>Profile</h1>

        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Status: {user.isAdmin ? "Administrator" : "Customer"}</p>
      </div>

      <div className="card card--stack">
        <h2>My Orders</h2>

        {orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="stack">
            {orders.map((order) => (
              <div key={order._id} className="order-row">
                <div>
                  <p className="order-row__id">{order._id}</p>
                  <p className="muted">
                    {order.isPaid ? "Paid" : "Pending"} |{" "}
                    {order.isDelivered ? "Delivered" : "Not delivered"}
                  </p>
                </div>
                <strong>{formatCurrency(order.totalPrice)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
