import { CheckCircle2, MessageSquareText, PhoneMissed, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDemoWalkthroughData } from "@/lib/data/selectors";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DemoWalkthroughPage() {
  const walkthrough = getDemoWalkthroughData();

  const steps = [
    {
      title: "Missed call arrives",
      icon: PhoneMissed,
      detail: walkthrough.opportunity.callEvents[0]?.summary ?? "Inbound call was missed.",
    },
    {
      title: "Opportunity created",
      icon: TrendingUp,
      detail: `${walkthrough.opportunity.title} entered the unified inbox as a missed_call opportunity.`,
    },
    {
      title: "SMS sent",
      icon: MessageSquareText,
      detail: walkthrough.messages.find((message) => message.direction === "outbound")?.body ?? "Outbound SMS triggered.",
    },
    {
      title: "Contact replies",
      icon: MessageSquareText,
      detail: walkthrough.messages.find((message) => message.direction === "inbound")?.body ?? "Customer reply received.",
    },
    {
      title: "Booking logged",
      icon: CheckCircle2,
      detail: walkthrough.booking
        ? `${walkthrough.booking.title} for ${formatCurrency(walkthrough.booking.revenue)}`
        : "Booking not yet logged.",
    },
    {
      title: "Dashboard updates",
      icon: TrendingUp,
      detail: `Influenced revenue and bookings roll into reporting immediately for ${walkthrough.snapshot?.label ?? "current window"}.`,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Interactive tour"
        title="Demo walkthrough"
        description="A visual product tour of the missed-call recovery loop, showing exactly how an opportunity moves through the system."
      />

      <section className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow story</CardTitle>
            <CardDescription>How one missed call becomes recovered revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                  <step.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sky-600">Step {index + 1}</p>
                  <p className="font-medium text-slate-900">{step.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{step.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{walkthrough.opportunity.title}</CardTitle>
                  <CardDescription>
                    {walkthrough.opportunity.contact.firstName} {walkthrough.opportunity.contact.lastName}
                  </CardDescription>
                </div>
                <StatusBadge value={walkthrough.opportunity.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Opportunity type</p>
                  <p className="font-medium text-slate-900">
                    {walkthrough.opportunity.type.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Potential value</p>
                  <p className="font-medium text-slate-900">{formatCurrency(walkthrough.opportunity.value)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Last contact</p>
                  <p className="font-medium text-slate-900">
                    {walkthrough.opportunity.lastContactAt
                      ? formatRelativeTime(walkthrough.opportunity.lastContactAt)
                      : "Just created"}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">Thread snapshot</p>
                <div className="mt-3 space-y-3">
                  {walkthrough.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-2xl p-3 text-sm ${
                        message.direction === "outbound"
                          ? "ml-10 bg-slate-900 text-white"
                          : "mr-10 bg-white text-slate-900 shadow-sm"
                      }`}
                    >
                      {message.body}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resulting business impact</CardTitle>
              <CardDescription>What the owner sees after the workflow resolves</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Recovered booking</p>
                <p className="text-xl font-semibold text-slate-950">
                  {walkthrough.booking ? formatCurrency(walkthrough.booking.revenue) : "$0"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Bookings created</p>
                <p className="text-xl font-semibold text-slate-950">
                  {walkthrough.snapshot?.bookingsCreated ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Influenced revenue</p>
                <p className="text-xl font-semibold text-slate-950">
                  {formatCurrency(walkthrough.snapshot?.revenueInfluenced ?? 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
