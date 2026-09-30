import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../../context/AuthContext";

function RoleLayout() {
  const {
    role,
    profile,
    account,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const displayUser = {
    name: profile?.name || account?.email,
  };

  return (
    <DashboardLayout
      role={role}
      user={displayUser}
      onLogout={handleLogout}
    >
      <Outlet />
    </DashboardLayout>
  );
}

export default RoleLayout;