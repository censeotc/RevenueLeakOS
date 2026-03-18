"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/revenue";

export function AppSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full flex-col gap-6 border-r border-slate-200 bg-white px-4 py-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand-600">Workspace</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">Revenue recovery</h2>
        <p className="mt-1 text-sm text-slate-500">Signed in as {role}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {APP_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link className={cn("rounded-xl px-3 py-2 text-sm transition", isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950")} href={item.href} key={item.href}>
              <div className="font-medium">{item.label}</div>
              {item.description ? <div className={cn("text-xs", isActive ? "text-slate-300" : "text-slate-500")}>{item.description}</div> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
