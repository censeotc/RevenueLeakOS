"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session-context";

const DEMO_ACCOUNTS = [
  { label: "Owner (Mike Kowalski)", email: "mike@northshoreheating.com", role: "Full access" },
  { label: "Manager (Sarah Chen)", email: "sarah@northshoreheating.com", role: "Manager access" },
  { label: "CSR (Jen Martinez)", email: "jen@northshoreheating.com", role: "CSR access" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useSession();
  const [email, setEmail] = useState("mike@northshoreheating.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/app/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push("/app/dashboard");
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="shadow-xl">
          <CardContent className="pt-8 pb-6 space-y-6">
            {/* Logo */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Zap className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">RevenueLeak OS</span>
              </div>
              <p className="text-sm text-muted-foreground">Revenue recovery for home-service companies</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="email@company.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input px-3 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleDemoLogin}>
              <Zap className="h-4 w-4 mr-2" />
              Enter Demo Mode (Owner)
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/onboarding" className="text-primary hover:underline">
                Get started
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card className="bg-amber-50/80 border-amber-200">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-amber-800 mb-3">Demo Accounts (password: demo1234)</p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleQuickLogin(acc.email)}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-amber-200 hover:border-amber-400 transition-colors"
                >
                  <div>
                    <p className="text-xs font-medium text-foreground">{acc.label}</p>
                    <p className="text-[10px] text-muted-foreground">{acc.email}</p>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{acc.role}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
