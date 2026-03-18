import { SectionHeader } from "@/components/section-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/session";
import { getDemoWalkthroughData } from "@/lib/services/reportingService";
import { formatCurrency } from "@/lib/utils";
import { logBookingAction, simulateMissedCallAction, simulateReplyAction } from "@/app/actions";

export default async function DemoWalkthroughPage() {
  const user = await getSessionUser();
  const data = await getDemoWalkthroughData(user.businessId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Demo Walkthrough"
        description="Pilot-ready visual flow from missed call to dashboard impact."
      />

      <Card>
        <CardHeader>
          <CardTitle>Workflow controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <form action={simulateMissedCallAction} className="rounded-md border border-slate-200 p-3">
            <input type="hidden" name="contactName" value="Taylor Harper" />
            <input type="hidden" name="fromNumber" value="+12485559988" />
            <input type="hidden" name="toNumber" value="+12485550111" />
            <p className="mb-2 text-sm font-medium">1) Capture missed call</p>
            <SubmitButton size="sm" pendingLabel="Running...">
              Simulate missed call
            </SubmitButton>
          </form>

          <form action={simulateReplyAction} className="rounded-md border border-slate-200 p-3">
            <input type="hidden" name="opportunityId" value={data.opportunityId ?? ""} />
            <input type="hidden" name="body" value="Yes, I can do Friday afternoon." />
            <p className="mb-2 text-sm font-medium">2) Simulate SMS reply</p>
            <SubmitButton
              size="sm"
              variant="outline"
              pendingLabel="Replying..."
              disabled={!data.opportunityId}
            >
              Capture reply
            </SubmitButton>
          </form>

          <form action={logBookingAction} className="rounded-md border border-slate-200 p-3">
            <input type="hidden" name="opportunityId" value={data.opportunityId ?? ""} />
            <input type="hidden" name="revenue" value="750" />
            <p className="mb-2 text-sm font-medium">3) Log booking</p>
            <SubmitButton size="sm" pendingLabel="Logging..." disabled={!data.opportunityId}>
              Log booking
            </SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual walkthrough state</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.contactName ? (
            <p className="text-sm text-slate-600">
              Current contact: <span className="font-medium text-slate-900">{data.contactName}</span>
            </p>
          ) : null}
          {data.opportunityTitle ? (
            <p className="text-sm text-slate-600">
              Opportunity: <span className="font-medium text-slate-900">{data.opportunityTitle}</span>
            </p>
          ) : null}

          <div className="space-y-2">
            {data.steps.map((step, index) => (
              <div key={step.key} className="rounded-md border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    {index + 1}. {step.label}
                  </p>
                  <Badge variant={step.done ? "success" : "secondary"}>
                    {step.done ? "complete" : "pending"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {step.timestamp ? step.timestamp.toLocaleString("en-US") : "Waiting for this step"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard impact snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-sm text-slate-500">Bookings created</p>
            <p className="text-xl font-semibold text-slate-900">{data.kpis.bookingsCreated}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-sm text-slate-500">Opportunities recovered</p>
            <p className="text-xl font-semibold text-slate-900">{data.kpis.opportunitiesRecovered}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-sm text-slate-500">Revenue influenced</p>
            <p className="text-xl font-semibold text-slate-900">
              {formatCurrency(data.kpis.revenueInfluenced)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
