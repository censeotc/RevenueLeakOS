import Link from "next/link";

import { OpportunityDetailCard } from "@/components/interactive";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOpportunitiesView } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const badgeVariant = (status: string) => {
  if (["booked", "won"].includes(status)) return "success" as const;
  if (status === "responded") return "info" as const;
  if (status === "lost") return "danger" as const;
  return "secondary" as const;
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const filter = params.filter === "missed_call" || params.filter === "estimate_rescue" || params.filter === "reactivation" ? params.filter : "all";
  const data = getOpportunitiesView(filter);
  const selected = data.selectedOpportunity;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Opportunities</p>
        <h1 className="text-3xl font-semibold tracking-tight">Unified pipeline across calls, estimates, and reactivation</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "missed_call", "estimate_rescue", "reactivation"] as const).map((item) => (
          <Link key={item} href={`/app/opportunities?filter=${item}`} className={`rounded-full px-4 py-2 text-sm font-medium ${filter === item ? "bg-zinc-950 text-white" : "bg-white text-zinc-600 border border-zinc-200"}`}>
            {item}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Opportunity table</CardTitle>
            <CardDescription>Every major workflow creates or updates one of these records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.opportunities.map((opportunity) => (
              <div key={opportunity.id} className="grid gap-3 rounded-xl border border-zinc-200 p-4 lg:grid-cols-[1.3fr_0.8fr_0.7fr_0.6fr] lg:items-center">
                <div>
                  <p className="font-medium">{opportunity.title}</p>
                  <p className="text-sm text-zinc-500">{opportunity.contact ? `${opportunity.contact.firstName} ${opportunity.contact.lastName}` : "Unknown contact"}</p>
                  <p className="mt-1 text-xs text-zinc-400">Created {formatDate(opportunity.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{formatCurrency(opportunity.influencedRevenueCents)}</p>
                  <p className="text-xs text-zinc-500">Influenced value</p>
                </div>
                <div>
                  <Badge variant={badgeVariant(opportunity.status)}>{opportunity.status}</Badge>
                  <p className="mt-2 text-xs text-zinc-500">Owner: {opportunity.owner?.name ?? "Unassigned"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{opportunity.type}</p>
                  <p className="text-xs text-zinc-500">{opportunity.latestMessage?.body ?? opportunity.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selected ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selected.title}</CardTitle>
                <CardDescription>{selected.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Type</span><Badge variant="info">{selected.type}</Badge></div>
                <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Status</span><Badge variant={badgeVariant(selected.status)}>{selected.status}</Badge></div>
                <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Influenced value</span><span className="font-medium">{formatCurrency(selected.influencedRevenueCents)}</span></div>
                <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Linked estimate</span><span className="font-medium">{selected.estimate?.number ?? "-"}</span></div>
              </CardContent>
            </Card>
            <OpportunityDetailCard
              opportunityId={selected.id}
              ownerUserId={selected.ownerUserId}
              users={data.users}
              notes={selected.notes.map((note) => ({ ...note, author: data.users.find((user) => user.id === note.authorUserId)?.name }))}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
