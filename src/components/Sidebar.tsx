import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/api/adminAuthApi";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sessions", label: "Sessions", icon: ShieldCheck },
  { to: "/profile", label: "Profile", icon: User },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const admin = useAppSelector((s) => s.auth.admin);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi({ revoke_all: false }).unwrap();
    } catch {
      /* ignore */
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col",
          "border-r border-slate-200 bg-white",
          "transition-transform duration-300 ease-in-out will-change-transform",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/25">
              <img
                src="/logo.jpeg"
                alt="Usanex Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-slate-900">
                Usanex
              </p>
              <p className="truncate text-xs text-slate-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  "transition-colors duration-150",
                  isActive
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={[
                      "h-[18px] w-[18px] transition-colors",
                      isActive
                        ? "text-brand-600"
                        : "text-slate-400 group-hover:text-slate-600",
                    ].join(" ")}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-semibold text-white">
              {(admin?.full_name?.[0] ?? "A").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {admin?.full_name ?? "Admin"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {admin?.mobile_number ?? "—"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}