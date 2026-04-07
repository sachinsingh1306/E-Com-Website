import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import API from "../services/api";
import { formatCurrency, formatDate, getErrorMessage } from "../utils/helpers";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);

        if (!ignore) {
          setOrder(data);
          setError("");
        }
      } catch (error) {
        if (!ignore) {
          setError(getErrorMessage(error, "Unable to load order"));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchOrder();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return <Loader message="Loading order..." />;
  }

  if (error) {
    return <div className="message message--error">{error}</div>;
  }

  if (!order) {
    return <div className="message">Order not found.</div>;
  }

  return (
    <section className="content-grid">
      <div className="card card--stack">
        <h1>Order Details</h1>
        <p className="order-row__id">{order._id}</p>
        <p>
          Shipping: {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </p>
        <p>Payment method: {order.paymentMethod}</p>
        <p>Tracking Number: {order.trackingNumber || "Not assigned yet"}</p>
        <p>Paid: {order.isPaid ? formatDate(order.paidAt) : "Pending"}</p>
        <p>
          Delivered:{" "}
          {order.isDelivered ? formatDate(order.deliveredAt) : "Not delivered"}
        </p>
      </div>

      <div className="card card--stack">
        <h2>Items</h2>
        {order.orderItems?.map((item) => (
          <div key={item.product || item.name} className="order-row">
            <span>
              {item.name} x {item.qty}
            </span>
            <strong>{formatCurrency(item.price * item.qty)}</strong>
          </div>
        ))}
        <p className="summary-row summary-row--total">
          <span>Total</span>
          <strong>{formatCurrency(order.totalPrice)}</strong>
        </p>
      </div>
    </section>
  );
};

export default Order;
