import Link from "next/link";

import { CsvImportScaffold } from "@/components/csv-import-scaffold";
import { EmptyState } from "@/components/empty-state";
import { EstimateActions } from "@/components/interactive";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEstimatesView } from "@/lib/demo-data";
import { requireRouteAccess } from "@/lib/guards";
import { formatCurrency } from "@/lib/utils";
import { csvImportService } from "@/services/csv-import-service";

export default async function EstimatesPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  await requireRouteAccess("/app/estimates");
  const params = (await searchParams) ?? {};
  const status = params.status ?? "all";
  const data = getEstimatesView();
  const estimates = status === "all" ? data.estimates : data.estimates.filter((estimate) => estimate.status === status);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Estimates</p>
        <h1 className="text-3xl font-semibold tracking-tight">Stale estimate rescue queue</h1>
        <p className="mt-2 text-sm text-zinc-500">Default stale threshold: {data.staleEstimateDays} days.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", "open", "stale", "enrolled", "responded", "booked", "lost"] as const).map((item) => (
          <Link key={item} href={`/app/estimates?status=${item}`} className={`rounded-full px-4 py-2 text-sm font-medium ${status === item ? "bg-zinc-950 text-white" : "bg-white text-zinc-600 border border-zinc-200"}`}>
            {item}
          </Link>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Stale estimate list</CardTitle>
            <CardDescription>Open and stale quotes can be enrolled into the estimate_rescue workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {estimates.length ? (
              estimates.map((estimate) => (
                <div key={estimate.id} className="grid gap-4 rounded-xl border border-zinc-200 p-4 xl:grid-cols-[1fr_0.8fr_0.6fr_1fr] xl:items-center">
                  <div>
                    <p className="font-medium">{estimate.number} · {estimate.serviceType}</p>
                    <p className="text-sm text-zinc-500">{estimate.contact ? `${estimate.contact.firstName} ${estimate.contact.lastName}` : "Unknown contact"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(estimate.amountCents)}</p>
                    <p className="text-xs text-zinc-500">Age {estimate.ageInDays} days</p>
                  </div>
                  <div>
                    <Badge variant={estimate.status === "booked" ? "success" : estimate.status === "lost" ? "danger" : estimate.status === "responded" ? "info" : "secondary"}>{estimate.status}</Badge>
                  </div>
                  <EstimateActions estimateId={estimate.id} />
                </div>
              ))
            ) : (
              <EmptyState title="No estimates match this filter" description="The seeded demo queue is empty for this status. Switch the filter or create a new workflow outcome." />
            )}
          </CardContent>
        </Card>

        <CsvImportScaffold data={csvImportService.getImportScaffold("estimates")} />
      </div>
    </div>
  );
}
