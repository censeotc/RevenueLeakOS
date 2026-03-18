"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const DEMO_CREDENTIALS = {
  email: "mike@northshoreheating.com",
  password: "demo1234",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/app/dashboard";

  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    const res = await fetch("/api/auth/demo-login", { method: "POST" });
    if (res.ok) {
      router.push(redirectTo);
    } else {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError("");
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setLoading(true);
      await startSession();
    } else {
      setError("Invalid credentials. Use the demo credentials shown above.");
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await startSession();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">RevenueLeak OS</h1>
          <p className="text-sm text-slate-400">Revenue recovery for home-service businesses</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardContent className="pt-6 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-600 bg-slate-700/50 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  className="w-full h-10 rounded-lg border border-slate-600 bg-slate-700/50 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800/50 px-2 text-slate-500">or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-200 hover:bg-slate-700"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                <Zap className="mr-2 h-4 w-4 text-primary" />
                Enter Demo Mode
              </Button>
              <p className="text-center text-xs text-slate-500">
                Demo: <span className="font-mono text-slate-400">{DEMO_CREDENTIALS.email}</span> / <span className="font-mono text-slate-400">demo1234</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500">
          No account?{" "}
          <Link href="/onboarding" className="text-primary hover:underline">
            Request pilot access
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
