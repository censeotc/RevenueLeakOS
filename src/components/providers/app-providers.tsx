"use client";

import { DemoSessionProvider } from "@/components/providers/demo-session-provider";
import { ToastProvider } from "@/components/ui/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DemoSessionProvider>{children}</DemoSessionProvider>
    </ToastProvider>
  );
}
