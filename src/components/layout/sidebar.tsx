"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Target,
  Phone,
  FileText,
  RefreshCw,
  BarChart3,
  Users,
  Megaphone,
  Mail,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/opportunities", label: "Opportunities", icon: Target },
  { href: "/app/calls", label: "Calls", icon: Phone },
  { href: "/app/estimates", label: "Estimates", icon: FileText },
  { href: "/app/reactivation", label: "Reactivation", icon: RefreshCw },
  { href: "/app/reports", label: "Reports", icon: BarChart3 },
  { href: "/app/contacts", label: "Contacts", icon: Users },
  { href: "/app/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/app/templates", label: "Templates", icon: Mail },
  { href: "/app/integrations", label: "Integrations", icon: Plug },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { session, logout } = useAuth();

  const initials = session?.user.name
    .split(" ")
    .map((n) => n[0])
    .join("") || "??";

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">RevenueLeak</span>
            <span className="text-[10px] font-medium text-muted-foreground">OS</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <div className="pt-2 border-t border-border mt-2">
          <Link
            href="/app/walkthrough"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/app/walkthrough"
                ? "bg-emerald-100 text-emerald-800"
                : "text-emerald-600 hover:bg-emerald-50"
            )}
            title={collapsed ? "Demo Walkthrough" : undefined}
          >
            <PlayCircle className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Demo Walkthrough</span>}
          </Link>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium block truncate">{session?.user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{session?.user.role}</span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
