import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const buildRedirectPath = (location) =>
  encodeURIComponent(
    `${location.pathname}${location.search}${location.hash}`
  );

export const ProtectedRoute = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) {
    return (
      <Navigate
        to={`/login?redirect=${buildRedirectPath(location)}`}
        replace
      />
    );
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) {
    return (
      <Navigate
        to={`/login?redirect=${buildRedirectPath(location)}`}
        replace
      />
    );
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
