"use client";

import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

export function AppTopbar() {
  const { business } = useCurrentBusiness();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {business?.name ?? "Loading..."}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Demo User</span>
      </div>
    </div>
  );
}
