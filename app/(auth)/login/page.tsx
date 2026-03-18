"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/domain/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginInput = z.infer<typeof loginSchema>;

const demoUsers = [
  "owner@northshore.demo / Demo@12345",
  "manager@northshore.demo / Demo@12345",
  "csr@northshore.demo / Demo@12345",
];

export default function LoginPage() {
  const router = useRouter();
  const callbackUrl = "/app/dashboard";
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push(result.url ?? callbackUrl);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to RevenueLeak OS</CardTitle>
          <CardDescription>Use the seeded demo users to access the internal app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="mb-2 font-semibold text-slate-700">Seeded credentials</p>
            <ul className="space-y-1">
              {demoUsers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
