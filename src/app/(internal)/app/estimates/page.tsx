import Link from "next/link";

import { enrollEstimateAction, updateEstimateStatusAction } from "@/app/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { CsvImportScaffold } from "@/components/import/csv-import-scaffold";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEstimates } from "@/lib/data/selectors";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const filters = ["all", "stale", "open", "responded", "booked", "lost"];

export default async function EstimatesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter ?? "all";
  const estimates = getEstimates(filter);

  return (
    <>
      <PageHeader
        eyebrow="Estimate rescue"
        title="Estimates"
        description="Surface stale proposals, enroll them into follow-up, and keep estimate rescue opportunities synchronized."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button key={item} asChild variant={filter === item ? "default" : "outline"} size="sm">
            <Link href={`/app/estimates?filter=${item}`}>{item}</Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stale estimate queue</CardTitle>
          <CardDescription>Age in days, amount, service type, and rescue actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {estimates.map((estimate) => (
            <div key={estimate.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">
                    {estimate.estimateNumber} · {estimate.contact.firstName} {estimate.contact.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{estimate.serviceType}</p>
                </div>
                <StatusBadge value={estimate.status} />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="text-slate-500">Age</p>
                  <p className="font-medium text-slate-900">{estimate.ageInDays} days</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="text-slate-500">Amount</p>
                  <p className="font-medium text-slate-900">{formatCurrency(estimate.amount)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="text-slate-500">Linked opportunity</p>
                  <p className="font-medium text-slate-900">
                    {estimate.opportunity?.title ?? "Not enrolled"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="text-slate-500">Contact</p>
                  <p className="font-medium text-slate-900">{estimate.contact.phone}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <form action={enrollEstimateAction}>
                  <input type="hidden" name="estimateId" value={estimate.id} />
                  <Button size="sm" type="submit">
                    Enroll in follow-up
                  </Button>
                </form>
                <form action={updateEstimateStatusAction} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="estimateId" value={estimate.id} />
                  <Select name="status" defaultValue={estimate.status === "open" || estimate.status === "stale" ? "responded" : estimate.status}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["responded", "booked", "lost"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" type="submit" variant="outline">
                    Save
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <CsvImportScaffold mode="estimates" />
    </>
  );
}
