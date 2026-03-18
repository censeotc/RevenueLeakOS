"use client";

import { createContext, useContext } from "react";
import type { DemoSession } from "@/lib/demo-session";
import type { PilotDataSnapshot } from "@/services/pilot-data";

interface PilotAppContextValue {
  session: DemoSession;
  data: PilotDataSnapshot;
}

const PilotAppContext = createContext<PilotAppContextValue | null>(null);

export function PilotDataProvider({
  session,
  initialData,
  children,
}: {
  session: DemoSession;
  initialData: PilotDataSnapshot;
  children: React.ReactNode;
}) {
  return (
    <PilotAppContext.Provider value={{ session, data: initialData }}>
      {children}
    </PilotAppContext.Provider>
  );
}

export function usePilotAppContext() {
  const context = useContext(PilotAppContext);

  if (!context) {
    throw new Error("usePilotAppContext must be used within PilotDataProvider");
  }

  return context;
}

export function usePilotSession() {
  return usePilotAppContext().session;
}

export function usePilotData() {
  return usePilotAppContext().data;
}
