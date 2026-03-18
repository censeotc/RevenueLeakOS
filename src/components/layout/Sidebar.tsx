"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Phone,
  FileText,
  RefreshCw,
  Megaphone,
  Users,
  BarChart3,
  MessageSquare,
  Puzzle,
  Settings,
  PlayCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Opportunities", href: "/app/opportunities", icon: Target },
  { label: "Calls", href: "/app/calls", icon: Phone },
  { label: "Estimates", href: "/app/estimates", icon: FileText },
  { label: "Reactivation", href: "/app/reactivation", icon: RefreshCw },
  { label: "Campaigns", href: "/app/campaigns", icon: Megaphone },
  { label: "Contacts", href: "/app/contacts", icon: Users },
  { label: "Reports", href: "/app/reports", icon: BarChart3 },
  { label: "Templates", href: "/app/templates", icon: MessageSquare },
  { label: "Integrations", href: "/app/integrations", icon: Puzzle },
  { label: "Settings", href: "/app/settings", icon: Settings, roles: ["owner", "manager"] },
  { label: "Demo Walkthrough", href: "/app/demo-walkthrough", icon: PlayCircle },
];

interface SidebarProps {
  userRole: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/app/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">RevenueLeak OS</p>
            <p className="text-slate-500 text-xs">Revenue Recovery</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-slate-600 text-xs">North Shore Heating & Plumbing</p>
        <p className="text-slate-700 text-xs mt-0.5 capitalize">{userRole} access</p>
      </div>
    </aside>
  );
}
