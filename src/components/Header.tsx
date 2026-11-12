import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sessions": "Sessions",
  "/profile": "Profile",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation();
  const admin = useAppSelector((s) => s.auth.admin);
  const title = titles[pathname] ?? "Usanex Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="-ml-1 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight text-slate-800">
            {admin?.full_name ?? "Admin"}
          </p>
          <p className="text-xs leading-tight text-slate-500">
            {admin?.is_super_admin ? "Super Admin" : "Admin"}
          </p>
        </div>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-semibold text-white shadow-sm shadow-brand-500/25">
          {(admin?.full_name?.[0] ?? "A").toUpperCase()}
        </div>
      </div>
    </header>
  );
}