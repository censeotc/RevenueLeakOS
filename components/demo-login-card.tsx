"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DEMO_EMAIL = "owner@northshorehvac.com";
const DEMO_PASSWORD = "DemoPass123!";

export function DemoLoginCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInToDemo = async () => {
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      redirect: false,
      callbackUrl: "/app/dashboard",
    });

    if (result?.error) {
      setError("Demo sign-in failed. Confirm the seed user exists.");
      setLoading(false);
      return;
    }

    window.location.href = "/app/dashboard";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Demo Login</CardTitle>
        <CardDescription>
          One-click sign-in for the seeded owner account in the internal pilot app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <p>
            <span className="font-medium">Email:</span> {DEMO_EMAIL}
          </p>
          <p>
            <span className="font-medium">Password:</span> {DEMO_PASSWORD}
          </p>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button onClick={signInToDemo} disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign in as Demo Owner"}
        </Button>
      </CardContent>
    </Card>
  );
}
