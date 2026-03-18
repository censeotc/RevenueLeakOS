"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { DemoSessionPayload } from "@/lib/auth";

interface DemoSessionContextValue {
  session: DemoSessionPayload | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  setSession: (session: DemoSessionPayload | null) => void;
}

const DemoSessionContext = createContext<DemoSessionContextValue | undefined>(undefined);

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<DemoSessionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setSession(null);
        return;
      }

      const payload = (await response.json()) as { session: DemoSessionPayload | null };
      setSession(payload.session);
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      refreshSession,
      setSession,
    }),
    [session, isLoading, refreshSession]
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) {
    throw new Error("useDemoSession must be used within DemoSessionProvider");
  }

  return context;
}
