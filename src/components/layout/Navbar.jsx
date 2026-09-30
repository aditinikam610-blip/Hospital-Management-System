import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  PanelLeftClose,
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { ROLE_LABELS } from "../../constants/navConfig";

function titleFromPath(pathname) {
  const segment =
    pathname.split("/").filter(Boolean).pop() || "dashboard";

  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Navbar({
  role,
  user,
  onOpenMobileMenu,
  onToggleCollapse,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  const pageTitle = titleFromPath(location.pathname);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
      {/* Mobile Menu */}
      <button
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className="rounded-card p-2 text-text-muted hover:bg-bg lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Collapse */}
      <button
        onClick={onToggleCollapse}
        aria-label="Collapse sidebar"
        className="hidden rounded-card p-2 text-text-muted hover:bg-bg lg:inline-flex"
      >
        <PanelLeftClose size={20} />
      </button>

      {/* Page Title */}
      <h1 className="text-lg font-semibold text-text">
        {pageTitle}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative rounded-card p-2 text-text-muted hover:bg-bg"
        >
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-status-danger" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-card px-2 py-1.5 hover:bg-bg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {initials}
            </span>

            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-text">
                {user?.name}
              </span>

              <span className="block text-xs text-text-muted">
                {ROLE_LABELS[role]}
              </span>
            </span>

            <ChevronDown
              size={16}
              className="text-text-muted"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-card border border-border bg-surface shadow-card">
              <button
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-bg"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-sm text-status-danger hover:bg-bg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;