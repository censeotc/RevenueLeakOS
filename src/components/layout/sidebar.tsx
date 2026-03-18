"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  MapPin,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/session-context";

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

const bottomItems = [
  { href: "/app/walkthrough", label: "Demo Walkthrough", icon: PlayCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { session, logout } = useSession();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const initials = session?.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
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
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Business name */}
      {!collapsed && session && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{session.businessName}</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
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
      </nav>

      {/* Bottom items */}
      <div className="border-t border-border p-2 space-y-0.5">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
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
      </div>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
            {initials}
          </div>
          {!collapsed && session && (
            <>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{session.user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{session.user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground p-1 rounded"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
