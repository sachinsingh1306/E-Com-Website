import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import API from "../services/api";
import { formatCurrency, formatDate, getErrorMessage } from "../utils/helpers";

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
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-600 shadow-sm">
          Profile not found.
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Account
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your account details and review your orders.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-2xl font-bold text-white shadow-md">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-900">Name:</span> {user.name}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-900">Email:</span> {user.email}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-900">Status:</span>{" "}
                {user.isAdmin ? "Administrator" : "Customer"}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>

            {orders.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center">
                <p className="text-lg font-semibold text-slate-800">
                  No orders yet
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Start shopping and your orders will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="break-all text-xs font-medium uppercase tracking-wider text-slate-400">
                          Order ID
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {order._id}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-lg font-bold text-slate-900">
                          {formatCurrency(order.totalPrice)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.createdAt ? formatDate(order.createdAt) : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.isDelivered
                            ? "bg-sky-100 text-sky-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Not delivered"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
