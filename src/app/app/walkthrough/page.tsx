"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Phone,
  FileText,
  RefreshCw,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Play,
  Zap,
  Users,
  Megaphone,
  DollarSign,
} from "lucide-react";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  highlight: string;
  substeps: string[];
  demoValue?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: "missed_call",
    title: "Missed Call Recovery",
    description: "See how RevenueLeak OS automatically catches and responds to missed calls — turning missed revenue into booked appointments.",
    icon: <Phone className="h-6 w-6" />,
    href: "/app/calls",
    highlight: "bg-red-50 border-red-200 text-red-700",
    substeps: [
      "Go to the Calls page",
      "Select a 'Missed' or 'After Hours' call from the list",
      "Review the SMS thread — notice the auto-reply was already sent",
      "Use the 'Send SMS' button to send a follow-up",
      "Mark the opportunity as Contacted",
    ],
    demoValue: "$189–$800 avg booking",
  },
  {
    id: "estimates",
    title: "Stale Estimate Rescue",
    description: "Identify estimates that have gone cold and automatically trigger follow-up sequences to bring customers back.",
    icon: <FileText className="h-6 w-6" />,
    href: "/app/estimates",
    highlight: "bg-amber-50 border-amber-200 text-amber-700",
    substeps: [
      "Go to the Estimates page",
      "Filter by 'Stale' to see at-risk estimates",
      "Notice EST-2026-008 ($12,500) from Paul Martinez is 11 days old",
      "Click 'Follow Up' on any stale estimate",
      "Review the automated follow-up in Opportunities",
    ],
    demoValue: "$22,700 at risk in demo",
  },
  {
    id: "reactivation",
    title: "Customer Reactivation",
    description: "Identify dormant customers and launch targeted campaigns to bring them back before they hire someone else.",
    icon: <RefreshCw className="h-6 w-6" />,
    href: "/app/reactivation",
    highlight: "bg-blue-50 border-blue-200 text-blue-700",
    substeps: [
      "Go to the Reactivation page",
      "Review the 4 pre-built segments (12+ months dormant, maintenance due, etc.)",
      "Click on 'No Service in 12+ Months' to expand the segment",
      "Review the customer list and estimated recovery value",
      "Click 'Launch' to simulate starting a campaign",
    ],
    demoValue: "11+ customers dormant",
  },
  {
    id: "opportunities",
    title: "Opportunity Pipeline",
    description: "All revenue recovery activities flow into the Opportunities pipeline — your central hub for follow-up and conversion.",
    icon: <Target className="h-6 w-6" />,
    href: "/app/opportunities",
    highlight: "bg-purple-50 border-purple-200 text-purple-700",
    substeps: [
      "Go to the Opportunities page",
      "Filter by type: Missed Call, Estimate Rescue, or Reactivation",
      "Click any opportunity to open the detail panel",
      "Review the SMS thread and linked contact",
      "Add a note and log a booking",
    ],
    demoValue: "15 active opportunities",
  },
  {
    id: "campaigns",
    title: "Campaigns & Automation",
    description: "Build multi-step outreach sequences that run on autopilot — SMS, email, and follow-up calls all in one flow.",
    icon: <Megaphone className="h-6 w-6" />,
    href: "/app/campaigns",
    highlight: "bg-green-50 border-green-200 text-green-700",
    substeps: [
      "Go to the Campaigns page",
      "Open the 'Winter Furnace Check-Up' campaign",
      "Review the 5-step sequence (SMS → Wait → Email → Wait → SMS)",
      "Check the stats: 38 sent, 12 responses, 6 bookings",
      "See how the 'Stale Estimate Recovery' campaign auto-enrolls new stale estimates",
    ],
    demoValue: "3 active campaigns",
  },
  {
    id: "reports",
    title: "Revenue Reports",
    description: "See exactly how much revenue was recovered, influenced, and remains in the pipeline — with period-over-period comparisons.",
    icon: <BarChart3 className="h-6 w-6" />,
    href: "/app/reports",
    highlight: "bg-emerald-50 border-emerald-200 text-emerald-700",
    substeps: [
      "Go to the Reports page",
      "Review Last 30 Days vs Previous 30 Days",
      "See the workflow comparison table (Missed Call, Estimate Rescue, Reactivation)",
      "Check the Response Time Trend — it's improving each period",
      "Note the $34,750 revenue influenced in the demo period",
    ],
    demoValue: "$34,750 influenced (30d)",
  },
];

const ROI_FACTS = [
  { label: "Avg missed call booking rate", value: "34%" },
  { label: "Avg stale estimate recovery rate", value: "22%" },
  { label: "Revenue per recovered booking", value: "$1,200" },
  { label: "Avg response time improvement", value: "62%" },
  { label: "Typical monthly revenue recovered", value: "$8,400" },
];

export default function WalkthroughPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((completedSteps.size / DEMO_STEPS.length) * 100);

  return (
    <div>
      <TopBar title="Demo Walkthrough" />
      <div className="p-6 space-y-6 max-w-5xl">
        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
              <Zap className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Welcome to RevenueLeak OS</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                This walkthrough shows you exactly how North Shore Heating & Plumbing uses RevenueLeak OS to recover revenue from missed calls, stale estimates, and dormant customers. Follow the steps below to explore all 6 core workflows.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{completedSteps.size}/{DEMO_STEPS.length} complete</span>
                  </div>
                  <div className="h-2 bg-primary/20 rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {completedSteps.size === DEMO_STEPS.length && (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Walkthrough complete!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ROI Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4" />
              Demo Business Snapshot — North Shore Heating & Plumbing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {ROI_FACTS.map((fact) => (
                <div key={fact.label} className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary">{fact.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{fact.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Guided Tour — 6 Core Workflows</h3>
          {DEMO_STEPS.map((step, index) => {
            const isActive = activeStep === step.id;
            const isDone = completedSteps.has(step.id);
            return (
              <Card
                key={step.id}
                className={`transition-all ${isDone ? "opacity-80" : ""} ${isActive ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-lg p-1.5 border text-sm ${step.highlight}`}>
                            {step.icon}
                          </div>
                          <h3 className="font-semibold">{step.title}</h3>
                          {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                        </div>
                        <button
                          onClick={() => setActiveStep(isActive ? null : step.id)}
                          className="text-xs text-muted-foreground hover:text-foreground shrink-0"
                        >
                          {isActive ? "Collapse" : "Expand"}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                      {step.demoValue && (
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium mt-2">
                          {step.demoValue}
                        </span>
                      )}

                      {isActive && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Steps to try:</p>
                          {step.substeps.map((sub, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{sub}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <Link href={step.href}>
                          <Button size="sm">
                            <Play className="h-3.5 w-3.5 mr-1.5" />
                            Try it now
                            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant={isDone ? "secondary" : "outline"}
                          onClick={() => toggleComplete(step.id)}
                        >
                          {isDone ? (
                            <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Done</>
                          ) : (
                            "Mark Complete"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6 pb-6 text-center space-y-4">
            <h3 className="text-xl font-bold">Ready to recover revenue for your business?</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              This demo uses North Shore Heating &amp; Plumbing&apos;s data. Your real account will connect to your Twilio number, field management software, and customer history.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/onboarding">
                <Button>
                  Start Your Free Trial
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/app/settings">
                <Button variant="outline">
                  Configure Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
