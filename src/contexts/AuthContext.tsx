import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, UserRole } from "@/types";
import { demoUsers, demoBusiness } from "@/data/seed";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string) => boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  businessName: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const saved = sessionStorage.getItem("rl_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const user = demoUsers.find((u) => u.id === parsed.userId);
        if (user) return { user, isAuthenticated: true };
      } catch { /* ignore */ }
    }
    return { user: null, isAuthenticated: false };
  });

  const login = useCallback((email: string): boolean => {
    const user = demoUsers.find((u) => u.email === email);
    if (!user) return false;
    sessionStorage.setItem("rl_auth", JSON.stringify({ userId: user.id }));
    setState({ user, isAuthenticated: true });
    return true;
  }, []);

  const loginAs = useCallback((role: UserRole) => {
    const user = demoUsers.find((u) => u.role === role);
    if (!user) return;
    sessionStorage.setItem("rl_auth", JSON.stringify({ userId: user.id }));
    setState({ user, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("rl_auth");
    setState({ user: null, isAuthenticated: false });
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => (state.user ? roles.includes(state.user.role) : false),
    [state.user]
  );

  return (
    <AuthContext.Provider
      value={{ ...state, login, loginAs, logout, hasRole, businessName: demoBusiness.name }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
