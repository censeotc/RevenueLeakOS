"use client";

import { Bell, Search } from "lucide-react";
import { DEMO_BUSINESS_NAME } from "@/lib/demo-session";

export function TopBar({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">{DEMO_BUSINESS_NAME}</p>
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
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
      </div>
    </header>
  );
}
