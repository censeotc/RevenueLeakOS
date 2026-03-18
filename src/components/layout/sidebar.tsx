"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePilotSession } from "@/components/providers/pilot-data-provider";
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
  Route,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/opportunities", label: "Opportunities", icon: Target },
  { href: "/calls", label: "Calls", icon: Phone },
  { href: "/estimates", label: "Estimates", icon: FileText },
  { href: "/reactivation", label: "Reactivation", icon: RefreshCw },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/templates", label: "Templates", icon: Mail },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/walkthrough", label: "Walkthrough", icon: Route },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const session = usePilotSession();

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

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
            {session.user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session.user.name}</span>
              <span className="text-xs capitalize text-muted-foreground">{session.user.role}</span>
            </div>
          )}
        </div>
        <Link
          href="/demo/logout"
          className={cn(
            "mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </Link>
      </div>
    </aside>
  );
}
