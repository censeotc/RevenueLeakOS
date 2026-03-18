"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DemoSession, UserRole } from "@/types";

const DEMO_USERS = [
  { id: "user_owner", name: "Mike Kowalski", email: "mike@northshoreheating.com", role: "owner" as UserRole, password: "demo1234" },
  { id: "user_manager", name: "Sarah Chen", email: "sarah@northshoreheating.com", role: "manager" as UserRole, password: "demo1234" },
  { id: "user_csr1", name: "Jen Martinez", email: "jen@northshoreheating.com", role: "csr" as UserRole, password: "demo1234" },
  { id: "user_csr2", name: "Dave Thompson", email: "dave@northshoreheating.com", role: "csr" as UserRole, password: "demo1234" },
];

const DEMO_BUSINESS = {
  id: "biz_northshore",
  name: "North Shore Heating & Plumbing",
};

const SESSION_KEY = "rl_demo_session";

interface SessionContextValue {
  session: DemoSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => void;
  hasPermission: (action: string) => boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: ["*"],
  manager: [
    "view_dashboard", "manage_opportunities", "manage_contacts",
    "send_messages", "launch_campaigns", "view_reports",
    "manage_templates", "manage_settings",
  ],
  csr: [
    "view_dashboard", "manage_opportunities", "manage_contacts",
    "send_messages",
  ],
  readonly: ["view_dashboard", "view_reports"],
};

const SessionContext = createContext<SessionContextValue>({
  session: null,
  isLoading: true,
  login: async () => ({ success: false }),
  loginAsDemo: () => {},
  logout: () => {},
  hasPermission: () => false,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const persistSession = (s: DemoSession) => {
    setSession(s);
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  };

  const login = async (email: string, password: string) => {
    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }
    persistSession({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      businessId: DEMO_BUSINESS.id,
      businessName: DEMO_BUSINESS.name,
    });
    return { success: true };
  };

  const loginAsDemo = () => {
    const user = DEMO_USERS[0];
    persistSession({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      businessId: DEMO_BUSINESS.id,
      businessName: DEMO_BUSINESS.name,
    });
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const hasPermission = (action: string): boolean => {
    if (!session) return false;
    const perms = ROLE_PERMISSIONS[session.user.role] || [];
    return perms.includes("*") || perms.includes(action);
  };

  return (
    <SessionContext.Provider value={{ session, isLoading, login, loginAsDemo, logout, hasPermission }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export function useRequireSession() {
  const ctx = useContext(SessionContext);
  return ctx;
}
