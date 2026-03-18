"use client";

import { Bell, Search } from "lucide-react";
import { useDemoSession } from "@/components/providers/demo-session-provider";
import { demoAlerts } from "@/services/seededDataService";

export function TopBar({ title }: { title: string }) {
  const { session } = useDemoSession();
  const unreadAlertCount = demoAlerts.filter((alert) => !alert.read).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">
          {session?.business.name ?? "RevenueLeak OS Demo"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <Bell className="h-5 w-5" />
          {unreadAlertCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
              {unreadAlertCount}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
