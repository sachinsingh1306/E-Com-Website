import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import API from "../services/api";
import { formatCurrency, formatDate, getErrorMessage } from "../utils/helpers";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [trackingInputs, setTrackingInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data || []);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load orders"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    const trackingNumber = (trackingInputs[id] || "").trim();

    if (!trackingNumber) {
      setError("Tracking number is required before approving delivery.");
      return;
    }

    try {
      await API.put(`/orders/${id}/deliver`, { trackingNumber });
      setError("");
      await fetchOrders();
    } catch (error) {
      setError(getErrorMessage(error, "Unable to approve delivery"));
    }
  };

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Orders</h1>
        </div>
      </div>

      {error && <div className="message message--error">{error}</div>}

      {loading ? (
        <Loader message="Loading orders..." />
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <div key={order._id} className="card card--stack">
              <div className="order-row">
                <div>
                  <p className="order-row__id">{order._id}</p>
                  <p>{order.user?.name || "Unknown user"}</p>
                  <p className="muted">{order.user?.email || "No email"}</p>
                </div>
                <strong>{formatCurrency(order.totalPrice)}</strong>
              </div>

              <p className="muted">
                Paid: {order.isPaid ? formatDate(order.paidAt) : "Pending"}
              </p>
              <p className="muted">
                Delivered: {order.isDelivered ? formatDate(order.deliveredAt) : "Not delivered"}
              </p>
              <p className="muted">
                Tracking No: {order.trackingNumber || "Not assigned"}
              </p>

              {!order.isDelivered && (
                <div className="stack">
                  <label className="field">
                    <span>Tracking Number</span>
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      value={trackingInputs[order._id] || ""}
                      onChange={(e) =>
                        setTrackingInputs((prev) => ({
                          ...prev,
                          [order._id]: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <button
                    className="button"
                    type="button"
                    onClick={() => deliverHandler(order._id)}
                  >
                    Approve Delivery
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
