import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { LogOut, HeartPulse, X } from "lucide-react";
import { NAV_CONFIG } from "../../constants/navConfig";

function Sidebar({
  role,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onLogout,
}) {
  const items = NAV_CONFIG[role] || [];

  const content = (
    <>
      <div className="flex items-center gap-2 px-4 py-4">
        <HeartPulse size={22} className="shrink-0 text-accent" />

        {!collapsed && (
          <span className="text-sm font-semibold text-white">
            HMS Portal
          </span>
        )}

        <button
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="ml-auto rounded-card p-1 text-white/70 hover:bg-white/10 lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-2">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-card px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-accent text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />

            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-2 py-2">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-card px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="shrink-0" />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "hidden lg:flex lg:flex-col bg-primary transition-all duration-200 ease-in-out",
          collapsed ? "lg:w-16" : "lg:w-60"
        )}
      >
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-text/40"
            onClick={onCloseMobile}
            role="presentation"
          />

          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-primary shadow-card">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;