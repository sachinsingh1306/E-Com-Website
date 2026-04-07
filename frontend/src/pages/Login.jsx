import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../services/api";
import { setCredentials } from "../redux/slices/userSlice";
import { getErrorMessage } from "../utils/helpers";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      dispatch(setCredentials(data));
      navigate(redirect);
    } catch (error) {
      setError(getErrorMessage(error, "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-500 p-10 text-white shadow-xl lg:block">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
            Welcome Back
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Login to continue your shopping journey
          </h1>
          <p className="mt-4 text-sm leading-6 text-sky-100">
            Access your orders, manage your profile, and explore the admin
            dashboard if you have permission.
          </p>
        </div>

        <form
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          onSubmit={submitHandler}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Access your profile, orders, and admin screens.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <button
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            New here?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-sky-600 hover:text-sky-700"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
