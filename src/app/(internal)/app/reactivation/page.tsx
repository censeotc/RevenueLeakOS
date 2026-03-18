import Link from "next/link";

import { launchReactivationCampaignAction } from "@/app/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDormantSegments } from "@/lib/data/selectors";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReactivationPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const params = await searchParams;
  const segments = getDormantSegments();
  const selected = segments.find((segment) => segment.id === params.segment) ?? segments[0];

  return (
    <>
      <PageHeader
        eyebrow="Dormant demand recovery"
        title="Reactivation"
        description="Build opportunity creation around dormant customer segments and launch recovery campaigns tied to expected value."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {segments.map((segment) => (
          <Link key={segment.id} href={`/app/reactivation?segment=${segment.id}`}>
            <Card className={selected.id === segment.id ? "border-slate-900" : ""}>
              <CardHeader>
                <CardTitle className="text-base">{segment.name}</CardTitle>
                <CardDescription>{segment.contacts.length} contacts ready</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-950">
                  {formatCurrency(segment.estimatedValue)}
                </div>
                <p className="mt-1 text-sm text-slate-500">Estimated recoverable value</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Segment preview</CardTitle>
            <CardDescription>{selected.name} contact candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selected.contacts.map((contact) => (
              <div
                key={contact.id}
                className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1.1fr,0.9fr,0.8fr]"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{contact.phone}</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-500">Tags</p>
                  <p className="font-medium text-slate-900">{contact.tags.join(", ")}</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-500">Suggested service</p>
                  <p className="font-medium text-slate-900">{selected.serviceType}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Launch plan</CardTitle>
            <CardDescription>Segment value, workflow outcome, and campaign launch controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Estimated value</p>
              <p className="mt-1 text-3xl font-semibold text-slate-950">
                {formatCurrency(selected.estimatedValue)}
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="font-medium text-slate-900">Workflow behavior</p>
                <p className="mt-1 text-slate-500">
                  Launching creates reactivation opportunities for non-active households and starts an active campaign with stop-on-booking conditions.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="font-medium text-slate-900">Default segments included</p>
                <ul className="mt-1 list-disc pl-5 text-slate-500">
                  <li>No service in 12+ months</li>
                  <li>Maintenance due</li>
                  <li>Membership renewal</li>
                  <li>Replacement cycle candidates</li>
                </ul>
              </div>
            </div>
            <form action={launchReactivationCampaignAction}>
              <input type="hidden" name="segmentId" value={selected.id} />
              <Button className="w-full" type="submit">
                Launch campaign
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
