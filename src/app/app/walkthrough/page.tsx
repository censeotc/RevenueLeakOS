import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRouteAccess } from "@/lib/guards";
import { formatCurrency, minutesLabel } from "@/lib/utils";
import { reportingService } from "@/services/reporting-service";

export default async function WalkthroughPage() {
  await requireRouteAccess("/app/walkthrough");
  const data = reportingService.getWalkthroughData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Walkthrough</p>
          <h1 className="text-3xl font-semibold tracking-tight">Demo walkthrough for pilots and internal reviews</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-500">
            Use this guided path to show the internal app in the right order: capture revenue leaks, convert them into opportunities, and watch reporting update.
          </p>
        </div>
        <Badge variant="info">Tenant: {data.business.name}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardDescription>Influenced revenue</CardDescription><CardTitle>{formatCurrency(data.summary.influencedRevenueCents)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Direct revenue</CardDescription><CardTitle>{formatCurrency(data.summary.directRevenueCents)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Recovered opportunities</CardDescription><CardTitle>{data.summary.recoveredOpportunities}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Average response time</CardDescription><CardTitle>{minutesLabel(data.summary.avgResponseTimeMinutes)}</CardTitle></CardHeader></Card>
      </div>

      {data.milestones.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {data.milestones.map((milestone, index) => (
            <Card key={milestone.id}>
              <CardHeader>
                <CardDescription>Step {index + 1}</CardDescription>
                <CardTitle>{milestone.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-500">{milestone.description}</p>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{milestone.statLabel}</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-950">{milestone.statValue}</p>
                </div>
                <Button asChild>
                  <Link href={milestone.href}>Open step</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Walkthrough data is unavailable" description="Seeded milestones will appear here once the demo tenant is initialized." />
      )}
    </div>
  );
}
