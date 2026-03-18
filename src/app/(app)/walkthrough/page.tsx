"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Phone,
  Target,
  MessageSquare,
  MessageCircle,
  CalendarCheck,
  BarChart3,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Zap,
  Clock,
  DollarSign,
  User,
} from "lucide-react";

// ── Step definitions ──────────────────────────────────────────────────────────

const DEMO_DELAY_MS = 900;

interface WalkthroughStep {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  description: string;
  detail: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const STEPS: WalkthroughStep[] = [
  {
    id: "missed_call",
    icon: Phone,
    label: "Missed Call",
    title: "Missed call detected",
    description: "Robert Anderson called (313) 555-1001 at 10:42 AM — no answer.",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    detail: (
      <div className="space-y-3">
        <PhoneEventCard
          callerName="Robert Anderson"
          callerNumber="+1 (313) 555-1001"
          calledNumber="+1 (313) 555-0100"
          time="10:42 AM"
          status="missed"
          duration={0}
        />
        <p className="text-xs text-muted-foreground">
          RevenueLeak OS detected the missed inbound call via the Twilio webhook and began
          the automated recovery workflow immediately.
        </p>
      </div>
    ),
  },
  {
    id: "opportunity_created",
    icon: Target,
    label: "Opportunity Created",
    title: "Opportunity automatically created",
    description: "A missed-call opportunity for Robert Anderson was created and assigned to Jen Martinez.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    detail: (
      <div className="space-y-3">
        <OpportunityCard
          id="opp_demo"
          title="Missed call — Robert Anderson"
          type="missed_call"
          status="new"
          estimatedValue={350}
          assignedTo="Jen Martinez"
          createdAt="just now"
        />
        <p className="text-xs text-muted-foreground">
          The system matched the caller&apos;s number to an existing contact, created a new
          opportunity record, and flagged it as high-priority since Robert is a returning customer
          with $4,200 lifetime value.
        </p>
      </div>
    ),
  },
  {
    id: "sms_sent",
    icon: MessageSquare,
    label: "SMS Sent",
    title: "Auto-SMS dispatched in &lt;30 seconds",
    description: "A personalised SMS was sent to Robert within 28 seconds of the missed call.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    detail: (
      <div className="space-y-3">
        <SMSBubble
          direction="outbound"
          body="Hi Robert, we missed your call at North Shore Heating & Plumbing! We're sorry we couldn't pick up. How can we help? Reply here or call us back at (313) 555-0100."
          time="10:42 AM"
          status="Delivered"
        />
        <p className="text-xs text-muted-foreground">
          The Missed Call Auto-Reply template was rendered with Robert&apos;s first name and sent
          via Twilio. The opportunity status updated to <strong>contacted</strong>.
        </p>
      </div>
    ),
  },
  {
    id: "reply_received",
    icon: MessageCircle,
    label: "Reply Received",
    title: "Customer replied",
    description: "Robert responded 6 minutes later: \"Hi, I need someone to look at my furnace. It's making a weird noise.\"",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    detail: (
      <div className="space-y-3">
        <div className="space-y-2">
          <SMSBubble
            direction="outbound"
            body="Hi Robert, we missed your call at North Shore Heating & Plumbing! We're sorry we couldn't pick up. How can we help?"
            time="10:42 AM"
            status="Delivered"
          />
          <SMSBubble
            direction="inbound"
            body="Hi, I need someone to look at my furnace. It's making a weird noise."
            time="10:48 AM"
          />
          <SMSBubble
            direction="outbound"
            body="We can definitely help with that! When would be a good time for a technician to come out?"
            time="10:48 AM"
            status="Delivered"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          The inbound reply was routed to the opportunity thread. The opportunity status
          updated to <strong>responded</strong> and an alert was sent to Jen Martinez.
        </p>
      </div>
    ),
  },
  {
    id: "booking_logged",
    icon: CalendarCheck,
    label: "Booking Logged",
    title: "Appointment booked",
    description: "Jen Martinez scheduled a furnace inspection for Thursday 2–4 PM and sent a confirmation SMS.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    detail: (
      <div className="space-y-3">
        <BookingCard
          title="Furnace Inspection"
          serviceType="HVAC Diagnostic"
          scheduledAt="Thursday, Mar 20 · 2:00–4:00 PM"
          contactName="Robert Anderson"
          estimatedValue={189}
          status="scheduled"
        />
        <SMSBubble
          direction="outbound"
          body="Hi Robert, your Furnace Inspection is confirmed for Thursday, Mar 20 at 2:00 PM. See you then! — North Shore Heating & Plumbing"
          time="10:52 AM"
          status="Delivered"
        />
        <p className="text-xs text-muted-foreground">
          The opportunity status moved to <strong>booked</strong> and the confirmed value
          of $189 was logged. The booking confirmation SMS was delivered automatically.
        </p>
      </div>
    ),
  },
  {
    id: "dashboard_updated",
    icon: BarChart3,
    label: "Dashboard Updated",
    title: "Dashboard & reports reflect the recovery",
    description: "The KPI dashboard updated in real time: +$189 revenue influenced, +1 booking, response time 6 minutes.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    detail: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <MetricDelta label="Revenue Influenced" value="$34,939" delta="+$189" positive />
          <MetricDelta label="Bookings Created" value="9" delta="+1" positive />
          <MetricDelta label="Avg Response Time" value="6 min" delta="−12 min" positive />
          <MetricDelta label="Conversion Rate" value="28.4%" delta="+1.7%" positive />
        </div>
        <p className="text-xs text-muted-foreground">
          Every step of the workflow — call, opportunity, SMS, reply, booking — is logged
          to the activity feed and aggregated into the 30-day report snapshot automatically.
        </p>
      </div>
    ),
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PhoneEventCard({
  callerName,
  callerNumber,
  calledNumber,
  time,
  status,
  duration,
}: {
  callerName: string;
  callerNumber: string;
  calledNumber: string;
  time: string;
  status: string;
  duration: number;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Phone className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">{callerName}</p>
            <p className="text-xs text-muted-foreground">{callerNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 capitalize">
            {status}
          </span>
          <p className="text-xs text-muted-foreground mt-1">{time}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground border-t border-red-200 pt-2">
        <span className="flex items-center gap-1">
          <Phone className="h-3 w-3" /> Inbound to {calledNumber}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {duration === 0 ? "No answer" : `${duration}s`}
        </span>
      </div>
    </div>
  );
}

function OpportunityCard({
  title,
  type,
  status,
  estimatedValue,
  assignedTo,
  createdAt,
}: {
  id: string;
  title: string;
  type: string;
  status: string;
  estimatedValue: number;
  assignedTo: string;
  createdAt: string;
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 capitalize">
          {status}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Target className="h-3 w-3" />
          {type.replace("_", " ")}
        </span>
        <span className="inline-flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          ${estimatedValue}
        </span>
        <span className="inline-flex items-center gap-1">
          <User className="h-3 w-3" />
          {assignedTo}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {createdAt}
        </span>
      </div>
    </div>
  );
}

function SMSBubble({
  direction,
  body,
  time,
  status,
}: {
  direction: "inbound" | "outbound";
  body: string;
  time: string;
  status?: string;
}) {
  const isOut = direction === "outbound";
  return (
    <div className={cn("flex", isOut ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
          isOut
            ? "rounded-br-sm bg-primary text-white"
            : "rounded-bl-sm bg-white border border-border text-foreground"
        )}
      >
        <p className="leading-snug">{body}</p>
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-[10px]",
            isOut ? "text-white/70 justify-end" : "text-muted-foreground"
          )}
        >
          <span>{time}</span>
          {status && <span>· {status}</span>}
        </div>
      </div>
    </div>
  );
}

function BookingCard({
  title,
  serviceType,
  scheduledAt,
  contactName,
  estimatedValue,
  status,
}: {
  title: string;
  serviceType: string;
  scheduledAt: string;
  contactName: string;
  estimatedValue: number;
  status: string;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{serviceType}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 capitalize">
          {status}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-amber-200 pt-2">
        <span className="flex items-center gap-1">
          <CalendarCheck className="h-3 w-3" />
          {scheduledAt}
        </span>
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {contactName}
        </span>
        <span className="flex items-center gap-1 font-medium text-amber-700">
          <DollarSign className="h-3 w-3" />${estimatedValue}
        </span>
      </div>
    </div>
  );
}

function MetricDelta({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-xs font-medium mt-0.5",
          positive ? "text-emerald-600" : "text-red-500"
        )}
      >
        {delta}
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WalkthroughPage() {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [running, setRunning] = useState(false);

  const isComplete = completedSteps.size === STEPS.length;

  const runAuto = async () => {
    setRunning(true);
    setActiveStep(-1);
    setCompletedSteps(new Set());

    for (let i = 0; i < STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, i === 0 ? 300 : DEMO_DELAY_MS));
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, DEMO_DELAY_MS * 1.5));
      setCompletedSteps((prev) => { const next = new Set(Array.from(prev)); next.add(i); return next; });
    }

    setRunning(false);
  };

  const reset = () => {
    setActiveStep(-1);
    setCompletedSteps(new Set());
    setRunning(false);
  };

  const stepTo = (idx: number) => {
    if (running) return;
    setActiveStep(idx);
    const completed = new Set<number>(Array.from({ length: idx }, (_, i) => i));
    setCompletedSteps(completed);
  };

  const selected = activeStep >= 0 ? STEPS[activeStep] : null;
  const SelectedIcon = selected?.icon ?? Zap;

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Demo Walkthrough" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">End-to-End Recovery Flow</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Watch how RevenueLeak OS turns a missed call into a booked appointment — automatically.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isComplete && (
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
              <Button
                onClick={isComplete ? reset : runAuto}
                disabled={running}
                size="sm"
              >
                {running ? (
                  <>
                    <span className="mr-1.5 h-3.5 w-3.5 animate-spin inline-block rounded-full border-2 border-white/30 border-t-white" />
                    Running…
                  </>
                ) : isComplete ? (
                  <>
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Replay
                  </>
                ) : (
                  <>
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                    Run Demo
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Timeline + Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2 space-y-2">
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                const isDone = completedSteps.has(idx);
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => stepTo(idx)}
                    disabled={running}
                    className={cn(
                      "w-full text-left rounded-xl border p-4 transition-all duration-200",
                      isActive
                        ? `${step.borderColor} ${step.bgColor} shadow-sm`
                        : isDone
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-border bg-white hover:bg-muted/30",
                      running && "cursor-not-allowed opacity-70"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all",
                          isDone
                            ? "bg-emerald-500 text-white"
                            : isActive
                            ? `${step.bgColor} ${step.color}`
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-wide",
                              isActive ? step.color : isDone ? "text-emerald-600" : "text-muted-foreground"
                            )}
                          >
                            Step {idx + 1}
                          </span>
                          {isActive && (
                            <span className="flex h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isActive ? "text-foreground" : isDone ? "text-emerald-800" : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                      {isActive && <ArrowRight className={cn("h-4 w-4 shrink-0", step.color)} />}
                    </div>
                  </button>
                );
              })}

              {isComplete && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-emerald-800">
                    Flow complete!
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    One missed call → one booked appointment → $189 recovered.
                  </p>
                </div>
              )}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-3">
              {selected ? (
                <Card
                  className={cn(
                    "border-2 transition-all duration-300",
                    selected.borderColor
                  )}
                >
                  <CardContent className="pt-5 space-y-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                          selected.bgColor
                        )}
                      >
                        <SelectedIcon className={cn("h-6 w-6", selected.color)} />
                      </div>
                      <div>
                        <p
                          className={cn("text-[11px] font-semibold uppercase tracking-widest", selected.color)}
                        >
                          Step {activeStep + 1} of {STEPS.length}
                        </p>
                        <h2
                          className="text-lg font-bold mt-0.5"
                          dangerouslySetInnerHTML={{ __html: selected.title }}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {selected.description}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">{selected.detail}</div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeStep <= 0 || running}
                        onClick={() => stepTo(activeStep - 1)}
                      >
                        ← Previous
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {activeStep + 1} / {STEPS.length}
                      </span>
                      <Button
                        size="sm"
                        disabled={activeStep >= STEPS.length - 1 || running}
                        onClick={() => {
                          const next = activeStep + 1;
                          setCompletedSteps((prev) => { const next = new Set(Array.from(prev)); next.add(activeStep); return next; });
                          setActiveStep(next);
                        }}
                      >
                        Next →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 h-full min-h-[360px] text-center p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold">Ready to demo</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                    Click <strong>Run Demo</strong> to watch the full workflow animate automatically,
                    or click any step in the timeline to jump directly to it.
                  </p>
                  <Button className="mt-4" onClick={runAuto}>
                    <Play className="mr-1.5 h-4 w-4" />
                    Run Demo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Time from call to SMS", value: "< 30 sec", icon: Zap, color: "text-violet-600", bg: "bg-violet-50" },
              { label: "Time to booking", value: "10 min", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Value recovered", value: "$189", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Steps automated", value: "4 of 6", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-4 pb-3">
                  <div className={cn("inline-flex rounded-lg p-2 mb-2", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
