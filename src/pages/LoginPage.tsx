import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { demoUsers } from "@/data/seed";
import type { UserRole } from "@/types";

const roleDescriptions: Record<UserRole, string> = {
  owner: "Full access to all features, settings, and reports",
  manager: "Manage team, campaigns, settings, and view reports",
  csr: "Handle calls, contacts, opportunities, and bookings",
};

export function LoginPage() {
  const { login, loginAs, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/app/dashboard", { replace: true });
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(email)) {
      navigate("/app/dashboard");
    } else {
      setError("Invalid email. Try one of the demo accounts below.");
    }
  }

  function handleQuickLogin(role: UserRole) {
    loginAs(role);
    navigate("/app/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            R
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RevenueLeak OS</h1>
          <p className="text-gray-500 mt-1">Internal pilot demo</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="mike@northshoreheating.com"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              {error && <p className="text-xs text-danger-600 mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase mb-3">Quick Demo Login</p>
            <div className="space-y-2">
              {(["owner", "manager", "csr"] as const).map((role) => {
                const user = demoUsers.find((u) => u.role === role)!;
                return (
                  <button
                    key={role}
                    onClick={() => handleQuickLogin(role)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}{" "}
                        <span className="text-xs text-gray-400 capitalize">({role})</span>
                      </p>
                      <p className="text-xs text-gray-500 truncate">{roleDescriptions[role]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
