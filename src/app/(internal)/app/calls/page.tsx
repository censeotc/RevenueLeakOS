import Link from "next/link";

import { logBookingAction, simulateMissedCallAction, simulateReplyAction } from "@/app/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCalls } from "@/lib/data/selectors";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const callTabs = ["all", "missed", "after-hours", "abandoned", "responded", "booked", "lost"];

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab ?? "all";
  const calls = getCalls(tab);
  const featuredCall = calls[0];

  return (
    <>
      <PageHeader
        eyebrow="Missed-call recovery"
        title="Calls"
        description="Monitor missed, after-hours, abandoned, and recovered calls while keeping linked opportunity state in sync."
      />

      <div className="flex flex-wrap gap-2">
        {callTabs.map((item) => (
          <Button key={item} asChild variant={tab === item ? "default" : "outline"} size="sm">
            <Link href={`/app/calls?tab=${item}`}>{item.replace(/-/g, " ")}</Link>
          </Button>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Call queue</CardTitle>
            <CardDescription>
              Linked opportunity status, SMS thread preview, booking indicator, and intake summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {call.contact?.firstName} {call.contact?.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{call.phoneNumber}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={call.classification} />
                    {call.opportunity ? <StatusBadge value={call.opportunity.status} /> : null}
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{call.summary}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="text-slate-500">Opportunity</p>
                    <p className="font-medium text-slate-900">{call.opportunity?.title ?? "Not linked"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="text-slate-500">SMS preview</p>
                    <p className="font-medium text-slate-900">
                      {call.messages[0]?.body ?? "No thread yet"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="text-slate-500">Booking indicator</p>
                    <p className="font-medium text-slate-900">
                      {call.booking ? `${call.booking.title} · ${formatCurrency(call.booking.revenue)}` : "Not booked"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulate missed call workflow</CardTitle>
              <CardDescription>
                Creates contact if needed, creates opportunity + call event, sends mock SMS, and updates reporting state.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={simulateMissedCallAction} className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input name="firstName" placeholder="First name" required />
                  <Input name="lastName" placeholder="Last name" required />
                </div>
                <Input name="phone" placeholder="Phone" required />
                <Input name="serviceType" placeholder="Service type" defaultValue="Emergency furnace repair" required />
                <Input name="sourceLabel" placeholder="Source label" defaultValue="Google Ads" />
                <Textarea
                  name="summary"
                  placeholder="Intake summary"
                  defaultValue="Homeowner called for emergency no-heat service and no one answered."
                  required
                />
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input className="rounded border-slate-300" name="afterHours" type="checkbox" />
                  Mark as after-hours
                </label>
                <Button type="submit">Create missed-call opportunity</Button>
              </form>
            </CardContent>
          </Card>

          {featuredCall?.opportunity ? (
            <Card>
              <CardHeader>
                <CardTitle>SMS thread preview</CardTitle>
                <CardDescription>
                  Latest thread tied to {featuredCall.opportunity.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {featuredCall.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-2xl p-3 text-sm ${
                        message.direction === "outbound"
                          ? "ml-8 bg-slate-900 text-white"
                          : "mr-8 bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p>{message.body}</p>
                      <p className="mt-2 text-xs opacity-70">{formatRelativeTime(message.createdAt)}</p>
                    </div>
                  ))}
                </div>
                <form action={simulateReplyAction} className="space-y-2">
                  <input type="hidden" name="opportunityId" value={featuredCall.opportunity.id} />
                  <Textarea
                    name="body"
                    defaultValue="Yes, please text me available times for tomorrow afternoon."
                  />
                  <Button size="sm" type="submit" variant="outline">
                    Simulate reply
                  </Button>
                </form>
                <form action={logBookingAction} className="space-y-2">
                  <input type="hidden" name="opportunityId" value={featuredCall.opportunity.id} />
                  <Input name="title" defaultValue="Booked diagnostic visit" />
                  <Input name="revenue" type="number" defaultValue={featuredCall.opportunity.value} />
                  <Button size="sm" type="submit">
                    Log booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </>
  );
}
