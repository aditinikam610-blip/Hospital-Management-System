import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function DashboardLayout({
  role,
  user,
  onLogout,
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        role={role}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={onLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          role={role}
          user={user}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          onLogout={onLogout}
        />

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;