import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const {
    isAuthenticated,
    role,
    initializing,
  } = useAuth();

  const location = useLocation();

  if (initializing) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to={`/${role}/dashboard`}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;