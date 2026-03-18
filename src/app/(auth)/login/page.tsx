"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { demoUsers } from "@/services/seededDataService";
import { useDemoSession } from "@/components/providers/demo-session-provider";
import { toAppRoute } from "@/lib/app-routes";

export default function LoginPage() {
  const users = demoUsers;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useDemoSession();
  const { pushToast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [email, setEmail] = useState(users[0]?.email ?? "");
  const [password, setPassword] = useState("demo1234");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId),
    [selectedUserId, users]
  );

  const nextPath = searchParams.get("next");
  const redirectTarget = nextPath && nextPath.startsWith("/app/")
    ? nextPath
    : toAppRoute("/dashboard");

  const handleDemoLogin = async (userOverrideId?: string) => {
    setIsSubmitting(true);
    const activeUserId = userOverrideId ?? selectedUserId;

    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: activeUserId,
          email,
          password,
        }),
      });

      if (!response.ok) {
        pushToast({
          title: "Login failed",
          description: "Check your demo credentials and try again.",
          variant: "error",
        });
        return;
      }

      const payload = (await response.json()) as {
        session: {
          user: { id: string; name: string; email: string; role: "owner" | "manager" | "csr" | "readonly" };
          business: { id: string; name: string };
          issuedAt: number;
          expiresAt: number;
        };
      };
      setSession(payload.session);
      pushToast({
        title: "Welcome back",
        description: `Signed in as ${payload.session.user.name}.`,
        variant: "success",
      });
      router.push(redirectTarget);
    } catch {
      pushToast({
        title: "Login unavailable",
        description: "Please try again in a moment.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">RevenueLeak OS</span>
            </div>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Demo User</label>
              <select
                className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background"
                value={selectedUserId}
                onChange={(event) => {
                  const userId = event.target.value;
                  setSelectedUserId(userId);
                  const user = users.find((candidate) => candidate.id === userId);
                  if (user) {
                    setEmail(user.email);
                  }
                }}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                type="email"
                className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background"
                placeholder="mike@northshoreheating.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <input
                type="password"
                className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleDemoLogin} disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
            {selectedUser ? (
              <p className="text-xs text-muted-foreground">
                Role access preview: <span className="font-medium capitalize">{selectedUser.role}</span>
              </p>
            ) : null}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const defaultUserId = users[0]?.id ?? "";
              setSelectedUserId(defaultUserId);
              setEmail(users[0]?.email ?? "");
              setPassword("demo1234");
              void handleDemoLogin(defaultUserId);
            }}
            disabled={isSubmitting}
          >
            Enter Demo Mode
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/onboarding" className="text-primary hover:underline">
              Get started
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
