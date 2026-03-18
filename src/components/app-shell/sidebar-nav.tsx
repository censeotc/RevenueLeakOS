"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenCheck,
  CalendarSync,
  Gauge,
  LayoutTemplate,
  PhoneMissed,
  Plug,
  Settings,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";

import { getNavForRole } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const iconMap = {
  Dashboard: Gauge,
  Opportunities: Workflow,
  Calls: PhoneMissed,
  Estimates: Wrench,
  Reactivation: CalendarSync,
  Campaigns: BookOpenCheck,
  Contacts: Users,
  Reports: BarChart3,
  Templates: LayoutTemplate,
  Integrations: Plug,
  Settings,
  "Demo Walkthrough": Workflow,
} as const;

export function SidebarNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const navItems = getNavForRole(role);

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div>
          <p className="text-sm font-medium text-slate-500">RevenueLeak OS</p>
          <h1 className="text-lg font-semibold text-slate-950">North Shore Demo</h1>
        </div>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = iconMap[item.title as keyof typeof iconMap] ?? Workflow;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
