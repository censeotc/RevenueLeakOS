"use client";

import { cn } from "@/lib/utils";

interface CallsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "all", label: "All Calls" },
  { id: "missed", label: "Missed" },
  { id: "completed", label: "Completed" },
];

export function CallsTabs({ activeTab, onTabChange }: CallsTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg border bg-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
