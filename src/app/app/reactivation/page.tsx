import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ReactivationLauncher } from "@/components/interactive";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReactivationView } from "@/lib/demo-data";
import { requireRouteAccess } from "@/lib/guards";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ReactivationPage({ searchParams }: { searchParams?: Promise<{ segment?: string }> }) {
  await requireRouteAccess("/app/reactivation");
  const params = (await searchParams) ?? {};
  const segment = (["no_service_12_months", "maintenance_due", "membership_renewal", "replacement_cycle"] as const).includes((params.segment ?? "no_service_12_months") as never)
    ? (params.segment as "no_service_12_months" | "maintenance_due" | "membership_renewal" | "replacement_cycle")
    : "no_service_12_months";
  const data = getReactivationView(segment);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Reactivation</p>
        <h1 className="text-3xl font-semibold tracking-tight">Dormant demand segments</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.segments.map((item) => (
          <Link key={item.key} href={`/app/reactivation?segment=${item.key}`}>
            <Card className={item.key === data.activeSegment.key ? "border-zinc-950" : undefined}>
              <CardHeader>
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-3xl">{item.count}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500">Estimated value {formatCurrency(item.estimatedValue)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{data.activeSegment.title}</CardTitle>
          <CardDescription>Preview table of contacts who match the selected reactivation segment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReactivationLauncher segmentKey={data.activeSegment.key} estimatedValue={data.activeSegment.estimatedValue} />
          <div className="space-y-3">
            {data.activeSegment.contacts.length ? (
              data.activeSegment.contacts.map((contact) => (
                <div key={contact.id} className="grid gap-3 rounded-xl border border-zinc-200 p-4 lg:grid-cols-[0.9fr_0.7fr_0.7fr] lg:items-center">
                  <div>
                    <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                    <p className="text-sm text-zinc-500">{contact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last service</p>
                    <p className="text-xs text-zinc-500">{formatDate(contact.lastServiceDate ?? contact.dormantSince)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tags</p>
                    <p className="text-xs text-zinc-500">{contact.tags.join(", ")}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No contacts in this segment" description="This seeded segment is currently empty. Switch to another segment or launch from a more populated audience." />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
