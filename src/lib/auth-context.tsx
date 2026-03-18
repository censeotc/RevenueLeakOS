"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { demoUsers, demoBusiness } from "@/lib/demo-data";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "csr";
  phone: string;
}

export interface AuthSession {
  user: AuthUser;
  businessId: string;
  businessName: string;
  isDemo: boolean;
  loginAt: number;
}

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  demoLogin: (userId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "rl_session";

function persistSession(session: AuthSession) {
  if (typeof window !== "undefined") {
    document.cookie = `${SESSION_KEY}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=86400; SameSite=Lax`;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

function clearPersistedSession() {
  if (typeof window !== "undefined") {
    document.cookie = `${SESSION_KEY}=; path=/; max-age=0`;
    localStorage.removeItem(SESSION_KEY);
  }
}

function loadPersistedSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (Date.now() - parsed.loginAt > 24 * 60 * 60 * 1000) {
      clearPersistedSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = loadPersistedSession();
    setSession(stored);
    setLoading(false);
  }, []);

  const login = useCallback((email: string, _password: string): boolean => {
    const user = demoUsers.find((u) => u.email === email);
    if (!user) return false;

    const newSession: AuthSession = {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      businessId: demoBusiness.id,
      businessName: demoBusiness.name,
      isDemo: false,
      loginAt: Date.now(),
    };
    setSession(newSession);
    persistSession(newSession);
    return true;
  }, []);

  const demoLogin = useCallback((userId?: string) => {
    const user = userId ? demoUsers.find((u) => u.id === userId) : demoUsers[0];
    if (!user) return;

    const newSession: AuthSession = {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      businessId: demoBusiness.id,
      businessName: demoBusiness.name,
      isDemo: true,
      loginAt: Date.now(),
    };
    setSession(newSession);
    persistSession(newSession);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    clearPersistedSession();
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ session, loading, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.loading && !auth.session && pathname.startsWith("/app")) {
      router.replace("/login");
    }
  }, [auth.loading, auth.session, pathname, router]);

  return auth;
}
