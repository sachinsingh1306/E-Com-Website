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
    <section className="auth-shell">
      <form className="card auth-card" onSubmit={submitHandler}>
        <h1>Login</h1>
        <p className="muted">Access your profile, orders, and admin screens.</p>

        {error && <div className="message message--error">{error}</div>}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="muted">
          New here?{" "}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}>
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
