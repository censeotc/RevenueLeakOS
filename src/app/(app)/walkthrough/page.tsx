"use client";

import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Phone,
  PhoneMissed,
  Target,
  MessageSquare,
  MessageCircle,
  CalendarCheck,
  BarChart3,
  PlayCircle,
  Check,
  ChevronRight,
  RotateCcw,
  Zap,
  ArrowRight,
  Clock,
  User,
} from "lucide-react";

interface WalkthroughStep {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  detail: React.ReactNode;
}

interface SimulatedState {
  callReceived: boolean;
  callTime: Date | null;
  opportunityCreated: boolean;
  opportunityId: string | null;
  smsSent: boolean;
  smsBody: string;
  replyReceived: boolean;
  replyBody: string;
  bookingLogged: boolean;
  bookingDate: Date | null;
  dashboardUpdated: boolean;
  metrics: {
    revenueInfluenced: number;
    opportunitiesRecovered: number;
    bookingsCreated: number;
    avgResponseMinutes: number;
  };
}

const initialState: SimulatedState = {
  callReceived: false,
  callTime: null,
  opportunityCreated: false,
  opportunityId: null,
  smsSent: false,
  smsBody: "",
  replyReceived: false,
  replyBody: "",
  bookingLogged: false,
  bookingDate: null,
  dashboardUpdated: false,
  metrics: {
    revenueInfluenced: 34750,
    opportunitiesRecovered: 4,
    bookingsCreated: 8,
    avgResponseMinutes: 18,
  },
};

export default function WalkthroughPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState<SimulatedState>(initialState);
  const [animating, setAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const callerName = "Lisa Raymond";
  const callerPhone = "+1 (313) 555-2847";
  const businessName = "North Shore Heating & Plumbing";
  const businessPhone = "(313) 555-0100";

  const executeStep = useCallback(
    async (stepIndex: number) => {
      setAnimating(true);

      switch (stepIndex) {
        case 0:
          setState((prev) => ({
            ...prev,
            callReceived: true,
            callTime: new Date(),
          }));
          break;
        case 1:
          setState((prev) => ({
            ...prev,
            opportunityCreated: true,
            opportunityId: `opp_demo_${Date.now()}`,
          }));
          break;
        case 2:
          setState((prev) => ({
            ...prev,
            smsSent: true,
            smsBody: `Hi Lisa, we missed your call at ${businessName}! We're sorry we couldn't pick up. How can we help? Reply here or call us back at ${businessPhone}.`,
          }));
          break;
        case 3:
          setState((prev) => ({
            ...prev,
            replyReceived: true,
            replyBody:
              "Hi! My furnace is making a rattling noise and I'd like someone to take a look. Are you available this week?",
          }));
          break;
        case 4:
          setState((prev) => ({
            ...prev,
            bookingLogged: true,
            bookingDate: new Date(Date.now() + 2 * 86400000),
          }));
          break;
        case 5:
          setState((prev) => ({
            ...prev,
            dashboardUpdated: true,
            metrics: {
              revenueInfluenced: prev.metrics.revenueInfluenced + 350,
              opportunitiesRecovered: prev.metrics.opportunitiesRecovered + 1,
              bookingsCreated: prev.metrics.bookingsCreated + 1,
              avgResponseMinutes: 16,
            },
          }));
          break;
      }

      await new Promise((r) => setTimeout(r, 600));
      setAnimating(false);
    },
    []
  );

  const handleNext = useCallback(async () => {
    if (activeStep < 6) {
      await executeStep(activeStep);
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, executeStep]);

  const handleReset = () => {
    setActiveStep(0);
    setState(initialState);
    setAutoPlay(false);
  };

  useEffect(() => {
    if (!autoPlay || activeStep >= 6 || animating) return;
    const timer = setTimeout(() => handleNext(), 1800);
    return () => clearTimeout(timer);
  }, [autoPlay, activeStep, animating, handleNext]);

  const steps: WalkthroughStep[] = [
    {
      id: 1,
      key: "missed_call",
      title: "Missed Call Detected",
      description: `${callerName} calls your business line. Nobody picks up.`,
      icon: PhoneMissed,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      detail: (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <PhoneMissed className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Incoming Call - MISSED</p>
              <p className="text-sm text-red-700">{callerName} &middot; {callerPhone}</p>
              <p className="text-xs text-red-600 mt-1">
                {state.callTime ? state.callTime.toLocaleTimeString() : "Waiting..."}
              </p>
            </div>
            {state.callReceived && <StatusBadge status="missed" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Twilio webhook fires. RevenueLeak OS detects the missed call in real time.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      key: "opportunity_created",
      title: "Opportunity Created",
      description: "The system auto-creates a missed-call opportunity linked to this contact.",
      icon: Target,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      detail: (
        <div className="space-y-3">
          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">New Opportunity</span>
              </div>
              {state.opportunityCreated && <StatusBadge status="new" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Title</span>
                <span className="font-medium">Missed call - {callerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  Missed Call
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Value</span>
                <span className="font-semibold">$350</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contact</span>
                <span>{callerName}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Every missed call becomes a tracked revenue opportunity. Nothing falls through the cracks.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      key: "sms_sent",
      title: "Auto-SMS Sent",
      description: "An automated text message is dispatched within seconds via Twilio.",
      icon: MessageSquare,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      detail: (
        <div className="space-y-3">
          <div className="flex flex-col items-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary/10 p-4">
              <p className="text-sm">
                {state.smsSent
                  ? state.smsBody
                  : "Message will appear here..."}
              </p>
              {state.smsSent && (
                <div className="flex items-center gap-1 justify-end mt-2">
                  <Check className="h-3 w-3 text-primary" />
                  <span className="text-[10px] text-primary font-medium">Delivered</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 mr-1">
              {state.smsSent ? "Just now" : "Pending"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Uses the &quot;Missed Call Auto-Reply&quot; template. Personalized with the caller&apos;s name and business details.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      key: "reply_received",
      title: "Customer Replies",
      description: `${callerName} responds via text message with their service need.`,
      icon: MessageCircle,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      detail: (
        <div className="space-y-3">
          {state.smsSent && (
            <div className="flex flex-col items-end mb-2">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary/10 px-4 py-2.5">
                <p className="text-xs">{state.smsBody}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted p-4">
              <p className="text-sm">
                {state.replyReceived
                  ? state.replyBody
                  : "Waiting for customer reply..."}
              </p>
            </div>
            {state.replyReceived && (
              <span className="text-[10px] text-muted-foreground mt-1 ml-1">Just now</span>
            )}
          </div>
          {state.replyReceived && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
              <ArrowRight className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-xs text-purple-800">
                Opportunity status updated: <span className="font-semibold">Responded</span>
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 5,
      key: "booking_logged",
      title: "Booking Logged",
      description: "CSR creates a booking directly from the opportunity. Revenue captured.",
      icon: CalendarCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      detail: (
        <div className="space-y-3">
          <div className="border border-green-200 rounded-xl p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-900">Booking Created</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm font-medium">Furnace Diagnostic</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="text-sm font-medium">{callerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
                <p className="text-sm font-medium">
                  {state.bookingDate
                    ? state.bookingDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD"}
                  {" "}2:00 PM
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Est. Value</p>
                <p className="text-sm font-bold text-green-700">$350</p>
              </div>
            </div>
          </div>
          {state.bookingLogged && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <Check className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs text-green-800">
                Opportunity marked as <span className="font-semibold">Booked</span> &middot; $350 recovered
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 6,
      key: "dashboard_updated",
      title: "Dashboard Updated",
      description: "All KPIs refresh in real time. Revenue recovered, response time improved.",
      icon: BarChart3,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      detail: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Revenue Influenced"
              value={formatCurrency(state.metrics.revenueInfluenced)}
              delta={state.dashboardUpdated ? "+$350" : undefined}
              positive
            />
            <MetricCard
              label="Opps Recovered"
              value={state.metrics.opportunitiesRecovered.toString()}
              delta={state.dashboardUpdated ? "+1" : undefined}
              positive
            />
            <MetricCard
              label="Bookings Created"
              value={state.metrics.bookingsCreated.toString()}
              delta={state.dashboardUpdated ? "+1" : undefined}
              positive
            />
            <MetricCard
              label="Avg Response"
              value={`${state.metrics.avgResponseMinutes}m`}
              delta={state.dashboardUpdated ? "-2m" : undefined}
              positive
            />
          </div>
          {state.dashboardUpdated && (
            <p className="text-xs text-muted-foreground text-center">
              All metrics updated. This missed call is now a $350 booking.
            </p>
          )}
        </div>
      ),
    },
  ];

  const isComplete = activeStep >= 6;

  return (
    <div>
      <TopBar title="Demo Walkthrough" />
      <div className="p-6 space-y-6">
        {/* Hero */}
        <Card className="bg-gradient-to-br from-primary/5 via-background to-emerald-50/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">RevenueLeak OS in Action</h2>
                </div>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Walk through a complete missed-call recovery workflow. Watch how a single
                  missed call is automatically detected, an opportunity created, customer engaged
                  via SMS, and revenue recovered &mdash; all without manual effort.
                </p>
              </div>
              <div className="flex gap-2">
                {!isComplete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoPlay(!autoPlay)}
                    disabled={animating}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    {autoPlay ? "Pause" : "Auto-Play"}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {Math.min(activeStep + 1, 6)} of 6
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {isComplete ? "Complete!" : `${Math.round((activeStep / 6) * 100)}%`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(activeStep / 6) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Step timeline */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Steps</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {steps.map((step, i) => {
                    const isActive = activeStep === i;
                    const isDone = activeStep > i;

                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          if (isDone) setActiveStep(i);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                          isActive
                            ? "bg-primary/5 border-l-2 border-l-primary"
                            : isDone
                            ? "hover:bg-muted/50 border-l-2 border-l-emerald-500"
                            : "border-l-2 border-l-transparent opacity-50"
                        }`}
                      >
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isDone
                              ? "bg-emerald-100"
                              : isActive
                              ? step.iconBg
                              : "bg-muted"
                          }`}
                        >
                          {isDone ? (
                            <Check className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <step.icon
                              className={`h-5 w-5 ${
                                isActive ? step.iconColor : "text-muted-foreground"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              isDone
                                ? "text-emerald-800"
                                : isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {step.description}
                          </p>
                        </div>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active step detail */}
          <div className="lg:col-span-8">
            <Card className="min-h-[400px]">
              {isComplete ? (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-800">
                      <Check className="h-5 w-5" />
                      Walkthrough Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center py-6">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                          <Zap className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Revenue Recovered!</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          What would have been a lost customer became a $350 booking. This entire
                          flow happened automatically &mdash; from missed call detection to SMS
                          follow-up &mdash; in under 30 seconds.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <SummaryCard label="Time to Contact" value="< 30s" />
                        <SummaryCard label="Revenue Recovered" value="$350" />
                        <SummaryCard label="Manual Steps" value="1" sublabel="(log booking)" />
                        <SummaryCard label="Auto Steps" value="3" sublabel="(detect, create, SMS)" />
                      </div>

                      <div className="flex justify-center gap-3">
                        <Button onClick={handleReset} variant="outline">
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Run Again
                        </Button>
                        <Button onClick={() => (window.location.href = "/app/dashboard")}>
                          Go to Dashboard
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${steps[activeStep].iconBg}`}>
                        {(() => {
                          const Icon = steps[activeStep].icon;
                          return <Icon className={`h-4 w-4 ${steps[activeStep].iconColor}`} />;
                        })()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{steps[activeStep].title}</p>
                        <p className="text-xs text-muted-foreground font-normal">
                          Step {activeStep + 1} of 6
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        {steps[activeStep].description}
                      </p>

                      <div
                        className={`transition-opacity duration-300 ${
                          animating ? "opacity-50" : "opacity-100"
                        }`}
                      >
                        {steps[activeStep].detail}
                      </div>

                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button
                          onClick={handleNext}
                          disabled={animating}
                          className="min-w-[140px]"
                        >
                          {animating ? (
                            <span className="flex items-center gap-2">
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Execute Step
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>

            {/* Live event log */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Event Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border max-h-48 overflow-y-auto">
                  {activeStep === 0 && !state.callReceived && (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      Waiting for first step...
                    </div>
                  )}
                  {state.callReceived && (
                    <EventLogRow
                      icon={<PhoneMissed className="h-3.5 w-3.5 text-red-600" />}
                      text={`Missed call from ${callerName} (${callerPhone})`}
                      type="call.missed"
                    />
                  )}
                  {state.opportunityCreated && (
                    <EventLogRow
                      icon={<Target className="h-3.5 w-3.5 text-blue-600" />}
                      text={`Opportunity created: "Missed call - ${callerName}" ($350)`}
                      type="opportunity.created"
                    />
                  )}
                  {state.smsSent && (
                    <EventLogRow
                      icon={<MessageSquare className="h-3.5 w-3.5 text-emerald-600" />}
                      text={`SMS sent to ${callerPhone} via Twilio (delivered)`}
                      type="sms.sent"
                    />
                  )}
                  {state.replyReceived && (
                    <EventLogRow
                      icon={<MessageCircle className="h-3.5 w-3.5 text-purple-600" />}
                      text={`SMS reply received from ${callerName}. Status -> Responded`}
                      type="sms.received"
                    />
                  )}
                  {state.bookingLogged && (
                    <EventLogRow
                      icon={<CalendarCheck className="h-3.5 w-3.5 text-green-600" />}
                      text={`Booking created: Furnace Diagnostic for ${callerName} ($350)`}
                      type="booking.created"
                    />
                  )}
                  {state.dashboardUpdated && (
                    <EventLogRow
                      icon={<BarChart3 className="h-3.5 w-3.5 text-indigo-600" />}
                      text="Dashboard KPIs updated. Revenue influenced +$350"
                      type="dashboard.updated"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventLogRow({
  icon,
  text,
  type,
}: {
  icon: React.ReactNode;
  text: string;
  type: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="shrink-0">{icon}</div>
      <p className="text-sm flex-1">{text}</p>
      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{type}</span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
      {delta && (
        <p className={`text-xs font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
          {delta}
        </p>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {sublabel && (
        <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      )}
    </div>
  );
}
