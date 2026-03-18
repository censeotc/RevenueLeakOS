import { TopBar } from "@/components/layout/top-bar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePilotSession } from "@/lib/demo-session";
import { formatCurrency, formatMinutes, timeAgo } from "@/lib/utils";
import { getDemoWalkthroughScenario } from "@/services/opportunity-service";
import { getDashboardPageData } from "@/services/reporting-service";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  MessageSquare,
  Phone,
  Reply,
  Target,
} from "lucide-react";

const stepIcons = {
  "missed-call": Phone,
  "opportunity-created": Target,
  "sms-sent": MessageSquare,
  "reply-received": Reply,
  "booking-logged": CalendarCheck,
  "dashboard-updated": BarChart3,
};

export default async function WalkthroughPage() {
  const session = await requirePilotSession();
  const [scenario, dashboardData] = await Promise.all([
    getDemoWalkthroughScenario(session.businessId),
    getDashboardPageData(session.businessId),
  ]);

  const beforeSummary = dashboardData.summary;
  const afterSummary = scenario.dashboardAfter;

  return (
    <div>
      <TopBar title="Demo Walkthrough" />
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Missed call recovery in six steps</h2>
            <p className="text-sm text-muted-foreground">
              A pilot-safe visual walkthrough of how the internal app handles a missed call, books the job, and updates
              reporting.
            </p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <p className="font-semibold text-primary">{scenario.business.name}</p>
            <p className="text-muted-foreground">Assigned to {scenario.opportunity.assignedTo.name}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Walkthrough timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scenario.steps.map((step, index) => {
                const Icon = stepIcons[step.id as keyof typeof stepIcons];

                return (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      {index < scenario.steps.length - 1 && (
                        <div className="my-2 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex-1 rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{step.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <Badge variant="outline">{timeAgo(step.timestamp)}</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Missed call</p>
                </div>
                <p className="mt-2 text-sm font-semibold">{scenario.call.callerName}</p>
                <p className="text-xs text-muted-foreground">{scenario.call.callerNumber}</p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge status={scenario.call.status} />
                  <span className="text-xs text-muted-foreground">{timeAgo(scenario.call.callTime)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Opportunity</p>
                </div>
                <p className="mt-2 text-sm font-semibold">{scenario.opportunity.title}</p>
                <div className="mt-2 flex gap-2">
                  <StatusBadge status={scenario.opportunity.type} />
                  <StatusBadge status={scenario.opportunity.status} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Estimated recovery: {formatCurrency(scenario.opportunity.estimatedValue)}
                </p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">SMS thread</p>
                </div>
                <div className="space-y-2">
                  <div className="ml-6 rounded-xl bg-primary/10 p-3 text-sm">
                    {scenario.smsSent.body}
                  </div>
                  <div className="mr-6 rounded-xl bg-muted p-3 text-sm">
                    {scenario.smsReply.body}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-emerald-700" />
                  <p className="text-sm font-medium text-emerald-900">Booking logged</p>
                </div>
                <p className="mt-2 text-sm font-semibold">{scenario.booking.title}</p>
                <p className="text-xs text-emerald-800">
                  {scenario.booking.serviceType} - {formatCurrency(scenario.booking.estimatedValue)}
                </p>
                <p className="mt-1 text-xs text-emerald-800">
                  Scheduled {new Date(scenario.booking.scheduledAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">Revenue influenced</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xl font-semibold">{formatCurrency(beforeSummary.revenueInfluenced)}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xl font-semibold text-emerald-600">
                    {formatCurrency(afterSummary.revenueInfluenced)}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">Opportunities recovered</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xl font-semibold">{beforeSummary.opportunitiesRecovered}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xl font-semibold text-emerald-600">{afterSummary.opportunitiesRecovered}</p>
                </div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">Bookings created</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xl font-semibold">{beforeSummary.bookingsCreated}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xl font-semibold text-emerald-600">{afterSummary.bookingsCreated}</p>
                </div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">Avg response time</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xl font-semibold">{formatMinutes(beforeSummary.avgResponseMinutes)}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xl font-semibold text-emerald-600">
                    {formatMinutes(afterSummary.avgResponseMinutes)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold">Pilot-ready demo path</p>
                <p className="text-sm text-muted-foreground">
                  This page is intentionally deterministic: it shows the exact missed call → opportunity → SMS → reply
                  → booking → dashboard flow without requiring a live Twilio account or scheduler.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
