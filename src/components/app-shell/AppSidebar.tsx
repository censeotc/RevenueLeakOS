"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Phone,
  FileText,
  Users,
  Megaphone,
  BookUser,
  BarChart3,
  FileCode2,
  Plug,
  Settings,
  PlayCircle,
} from "lucide-react";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/opportunities", label: "Opportunities", icon: TrendingUp },
  { href: "/app/calls", label: "Calls & SMS", icon: Phone },
  { href: "/app/estimates", label: "Estimates", icon: FileText },
  { href: "/app/reactivation", label: "Reactivation", icon: Users },
  { href: "/app/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/app/contacts", label: "Contacts", icon: BookUser },
  { href: "/app/reports", label: "Reports", icon: BarChart3 },
  { href: "/app/templates", label: "Templates", icon: FileCode2 },
  { href: "/app/integrations", label: "Integrations", icon: Plug },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-100">
        <Link href="/app/dashboard">
          <Image src="/logo.svg" alt="RevenueLeakOS" width={140} height={28} />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Demo link */}
      <div className="p-3 border-t border-slate-100">
        <Link
          href="/app/demo-walkthrough"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <PlayCircle className="h-4 w-4 text-slate-400" />
          Demo walkthrough
        </Link>
      </div>
    </aside>
  );
}
