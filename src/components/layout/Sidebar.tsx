import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Phone, FileText, Target, Megaphone,
  FileCode, RotateCcw, BarChart3, Settings, Plug, BookOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/contacts", label: "Contacts", icon: Users },
  { to: "/app/calls", label: "Calls", icon: Phone },
  { to: "/app/estimates", label: "Estimates", icon: FileText },
  { to: "/app/opportunities", label: "Opportunities", icon: Target },
  { to: "/app/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/app/templates", label: "Templates", icon: FileCode },
  { to: "/app/reactivation", label: "Reactivation", icon: RotateCcw },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
  { to: "/app/integrations", label: "Integrations", icon: Plug },
  { to: "/app/settings", label: "Settings", icon: Settings, roles: ["owner", "manager"] as const },
  { to: "/app/walkthrough", label: "Demo Guide", icon: BookOpen },
];

export function Sidebar() {
  const { hasRole } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-gray-900 text-gray-300 flex flex-col z-30">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
          R
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">RevenueLeak OS</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {nav.map((item) => {
          if (item.roles && !hasRole(item.roles as any)) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-600/20 text-primary-400"
                    : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
