"use client";

import { Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

export function AppTopbar({ userName }: { userName: string }) {
  const business = useCurrentBusiness();
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{business.name}</p>
        <h1 className="text-xl font-semibold text-slate-950">Welcome back, {userName}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search opportunities, contacts, or calls" />
        </div>
        <button className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100" type="button">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
