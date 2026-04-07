import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) {
    const redirect = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`
    );
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) {
    const redirect = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`
    );
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
