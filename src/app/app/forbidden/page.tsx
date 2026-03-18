import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRouteAccess } from "@/lib/guards";

export default async function ForbiddenPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  const session = await requireRouteAccess("/app/forbidden");
  const params = (await searchParams) ?? {};

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Badge variant="warning">Role guard</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">This route is not available for the {session.user.role} role</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {params.from ? `You tried to open ${params.from}.` : "You tried to open a protected internal route."} Use the guided demo paths or switch to a broader seeded role from the login page.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>What you can do next</CardTitle>
          <CardDescription>Owners and managers can access setup and administration routes, while CSRs and read-only users see a narrower operating surface.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/app/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/app/walkthrough">Open walkthrough</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
