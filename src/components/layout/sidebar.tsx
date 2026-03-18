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
  Map,
  LogOut,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { INTERNAL_ROUTE_PATHS, toAppRoute } from "@/lib/app-routes";
import { hasRequiredRole } from "@/lib/auth";
import { useDemoSession } from "@/components/providers/demo-session-provider";
import { useToast } from "@/components/ui/toast";

const navItems = [
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.dashboard), label: "Dashboard", icon: LayoutDashboard },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.opportunities), label: "Opportunities", icon: Target },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.calls), label: "Calls", icon: Phone },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.estimates), label: "Estimates", icon: FileText },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.reactivation), label: "Reactivation", icon: RefreshCw },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.reports), label: "Reports", icon: BarChart3, minRole: "manager" as const },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.contacts), label: "Contacts", icon: Users },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.campaigns), label: "Campaigns", icon: Megaphone },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.templates), label: "Templates", icon: Mail },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.integrations), label: "Integrations", icon: Plug },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.imports), label: "Imports", icon: Upload },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.walkthrough), label: "Walkthrough", icon: Map },
  { href: toAppRoute(INTERNAL_ROUTE_PATHS.settings), label: "Settings", icon: Settings, minRole: "owner" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { pushToast } = useToast();
  const { session, setSession } = useDemoSession();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const visibleNavItems = useMemo(() => {
    const currentRole = session?.user.role;
    return navItems.filter((item) => {
      if (!item.minRole || !currentRole) {
        return true;
      }
      return hasRequiredRole(currentRole, item.minRole);
    });
  }, [session?.user.role]);

  const initials = useMemo(() => {
    const name = session?.user.name ?? "Demo User";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [session?.user.name]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      pushToast({
        title: "Signed out",
        description: "Your demo session has ended.",
        variant: "info",
      });
      router.push("/login");
    } catch {
      pushToast({
        title: "Could not sign out",
        description: "Please try again.",
        variant: "error",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

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
            <span className="text-sm font-bold text-foreground">
              RevenueLeak
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              OS
            </span>
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

      <nav className="flex-1 space-y-1 p-2">
        {visibleNavItems.map((item) => {
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

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.user.name ?? "Demo User"}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {session?.user.role ?? "guest"}
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        )}
      </div>
    </aside>
  );
}
