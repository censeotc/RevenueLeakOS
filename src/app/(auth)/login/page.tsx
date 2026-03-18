import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next || "/dashboard";
  const demoLoginHref = `/demo/login?next=${encodeURIComponent(next)}`;

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
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                type="email"
                className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background"
                placeholder="mike@northshoreheating.com"
                defaultValue="mike@northshoreheating.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <input
                type="password"
                className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background"
                placeholder="********"
                defaultValue="demo1234"
              />
            </div>
            <form action="/demo/login" method="get">
              <input type="hidden" name="next" value={next} />
              <Button className="w-full" type="submit">
                Sign In to Demo Workspace
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <form action="/demo/login" method="get">
            <input type="hidden" name="next" value="/walkthrough" />
            <Button variant="outline" className="w-full" type="submit">
              Enter Demo Walkthrough
            </Button>
          </form>

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
