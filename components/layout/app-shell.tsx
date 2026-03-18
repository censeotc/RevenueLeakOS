"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookCopy,
  BriefcaseBusiness,
  Cable,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
  PhoneCall,
  Settings,
  Target,
  Users,
} from "lucide-react";
import { UserRoleValue } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRoleValue[];
};

const navItems: NavItem[] = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "manager", "csr", "readonly"],
  },
  {
    href: "/app/opportunities",
    label: "Opportunities",
    icon: Target,
    roles: ["owner", "manager", "csr"],
  },
  {
    href: "/app/calls",
    label: "Calls",
    icon: PhoneCall,
    roles: ["owner", "manager", "csr"],
  },
  {
    href: "/app/estimates",
    label: "Estimates",
    icon: ClipboardList,
    roles: ["owner", "manager", "csr"],
  },
  {
    href: "/app/reactivation",
    label: "Reactivation",
    icon: Activity,
    roles: ["owner", "manager"],
  },
  {
    href: "/app/campaigns",
    label: "Campaigns",
    icon: Megaphone,
    roles: ["owner", "manager"],
  },
  {
    href: "/app/contacts",
    label: "Contacts",
    icon: Users,
    roles: ["owner", "manager", "csr"],
  },
  {
    href: "/app/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["owner", "manager", "readonly"],
  },
  {
    href: "/app/templates",
    label: "Templates",
    icon: BookCopy,
    roles: ["owner", "manager"],
  },
  {
    href: "/app/integrations",
    label: "Integrations",
    icon: Cable,
    roles: ["owner", "manager"],
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    roles: ["owner"],
  },
  {
    href: "/app/demo-walkthrough",
    label: "Demo Walkthrough",
    icon: BriefcaseBusiness,
    roles: ["owner", "manager", "csr", "readonly"],
  },
];

export function AppShell({
  role,
  userName,
  children,
}: {
  role: UserRoleValue;
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const availableNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              RevenueLeak OS
            </p>
            <p className="text-sm font-semibold text-slate-900">North Shore Heating & Plumbing</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {availableNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Revenue Recovery Ops</p>
            <p className="text-sm font-medium text-slate-900">Unified Opportunity Workspace</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            {userName} · {role}
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
