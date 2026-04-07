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
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-600 shadow-sm">
          Order not found.
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Order
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
            Order Details
          </h1>
          <p className="mt-2 break-all text-sm text-slate-500">{order._id}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Shipping Info</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Address:</span>{" "}
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Payment:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Tracking Number:</span>{" "}
                  {order.trackingNumber || "Not assigned yet"}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.isPaid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : "Payment Pending"}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.isDelivered
                      ? "bg-sky-100 text-sky-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {order.isDelivered
                    ? `Delivered on ${formatDate(order.deliveredAt)}`
                    : "Not Delivered"}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Order Items</h2>

              <div className="mt-5 space-y-4">
                {order.orderItems?.map((item) => (
                  <div
                    key={item.product || item.name}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Quantity: {item.qty}</p>
                    </div>
                    <strong className="text-slate-900">
                      {formatCurrency(item.price * item.qty)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Items Price</span>
                <strong className="text-slate-900">
                  {formatCurrency(order.itemsPrice)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <strong className="text-slate-900">
                  {formatCurrency(order.shippingPrice)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tax</span>
                <strong className="text-slate-900">
                  {formatCurrency(order.taxPrice)}
                </strong>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <strong className="text-2xl font-extrabold text-slate-900">
                    {formatCurrency(order.totalPrice)}
                  </strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Order;
