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
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              Orders
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Track payments, manage delivery approvals, and assign tracking numbers.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <Loader message="Loading orders..." />
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Order ID
                    </p>
                    <p className="break-all text-sm font-semibold text-slate-700">
                      {order._id}
                    </p>

                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {order.user?.name || "Unknown user"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.user?.email || "No email"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.isPaid
                          ? `Paid on ${formatDate(order.paidAt)}`
                          : "Payment Pending"}
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

                  <div className="min-w-[260px] space-y-4 rounded-2xl bg-slate-50 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Total Amount
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-slate-900">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Tracking Number
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {order.trackingNumber || "Not assigned"}
                      </p>
                    </div>

                    {!order.isDelivered && (
                      <div className="space-y-3">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-700">
                            Enter Tracking Number
                          </span>
                          <input
                            type="text"
                            placeholder="Tracking number"
                            value={trackingInputs[order._id] || ""}
                            onChange={(e) =>
                              setTrackingInputs((prev) => ({
                                ...prev,
                                [order._id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          />
                        </label>

                        <button
                          className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                          type="button"
                          onClick={() => deliverHandler(order._id)}
                        >
                          Approve Delivery
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminOrders;
