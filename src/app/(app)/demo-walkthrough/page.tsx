"use client";

import { useState } from "react";
import { Phone, MessageSquare, Target, Calendar, BarChart2, CheckCircle, ChevronRight, ChevronLeft, Play, PhoneMissed, Zap, DollarSign, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";

const STEPS = [
  {
    id: 1,
    title: "Missed Call Arrives",
    icon: PhoneMissed,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    description: "A potential customer calls your business number after hours. No one picks up.",
    detail: "Twilio webhook fires instantly. RevenueLeak OS receives the inbound call event, checks for duplicate suppression (4-hour window), and identifies the caller.",
    mockUI: (
      <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Incoming call detected
        </div>
        <div className="bg-slate-800 rounded-xl p-3">
          <p className="text-white text-sm font-semibold">Inbound Call</p>
          <p className="text-slate-400 text-xs mt-0.5">From: (734) 555-1009 — Chris Delgado</p>
          <p className="text-slate-400 text-xs">9:47 PM — After hours</p>
          <div className="mt-2 flex gap-2">
            <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded">Missed</span>
            <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">After Hours</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Opportunity Created",
    icon: Target,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    description: "A Missed Call opportunity is automatically created and assigned.",
    detail: "The contact is matched or created, an opportunity record is created with type=missed_call and status=new, and a call event is logged. The opportunity is queued for immediate follow-up.",
    mockUI: (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase">New Opportunity</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">New</span>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Missed Call — Chris Delgado</p>
          <p className="text-sm text-slate-500">Type: Missed Call · Source: After Hours</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 rounded p-2">
            <p className="text-slate-400">Contact</p>
            <p className="font-medium text-slate-800">Chris Delgado</p>
          </div>
          <div className="bg-slate-50 rounded p-2">
            <p className="text-slate-400">Phone</p>
            <p className="font-medium text-slate-800">(734) 555-1009</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "SMS Follow-Up Sent",
    icon: MessageSquare,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    description: "A personalized SMS is sent within seconds of the missed call.",
    detail: "TwilioMockService fires automatically. The message uses a template with the contact's first name and business details. The message event is logged.",
    mockUI: (
      <div className="bg-slate-900 rounded-2xl p-4 space-y-2">
        <p className="text-slate-400 text-xs mb-3">SMS Thread — Chris Delgado</p>
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white text-sm rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%]">
            Hi Chris, we missed your call at North Shore Heating & Plumbing! We want to help — reply here or call us back at (734) 555-0100.
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-slate-500">Delivered · 9:47 PM</span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Contact Replies",
    icon: MessageSquare,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    description: "The customer replies via SMS. The opportunity status updates automatically.",
    detail: "Inbound webhook processes the reply. Opportunity status moves from new → responded. A message event is logged. The CSR is notified and can continue the conversation.",
    mockUI: (
      <div className="bg-slate-900 rounded-2xl p-4 space-y-2">
        <p className="text-slate-400 text-xs mb-3">SMS Thread — Chris Delgado</p>
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white text-sm rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%]">
            Hi Chris, we missed your call at North Shore Heating & Plumbing! We want to help — reply here.
          </div>
        </div>
        <div className="flex justify-start mt-2">
          <div className="bg-slate-700 text-white text-sm rounded-2xl rounded-bl-sm px-3 py-2 max-w-[85%]">
            Hey! My furnace stopped working. Can you come tomorrow morning?
          </div>
        </div>
        <div className="flex justify-start">
          <span className="text-xs text-slate-500">Received · 9:53 PM</span>
        </div>
        <div className="bg-green-900/50 rounded-lg p-2 mt-2">
          <p className="text-xs text-green-400 font-medium">✓ Opportunity status → Responded</p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Booking Logged",
    icon: Calendar,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    description: "A booking is created and the opportunity is marked booked.",
    detail: "CSR creates a booking from the opportunity. The booking is attributed to the missed call workflow with attribution_method=direct. Opportunity status moves to booked.",
    mockUI: (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-semibold text-slate-900">Booking Created!</span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Service</span>
            <span className="font-medium text-slate-800">Furnace Repair</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scheduled</span>
            <span className="font-medium text-slate-800">Tomorrow, 9:00 AM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated</span>
            <span className="font-medium text-green-600">$850</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Attribution</span>
            <span className="font-medium text-blue-600">Missed Call (Direct)</span>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <p className="text-xs text-green-700 font-medium">✓ Opportunity status → Booked</p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Dashboard Updates",
    icon: BarChart2,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    description: "Revenue and metrics update on the dashboard instantly.",
    detail: "The booking revenue is added to the Revenue Influenced KPI. Bookings Created increments. The Recovery Trend chart updates. Activity log records the full workflow.",
    mockUI: (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase">Dashboard Updated</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Revenue Influenced", value: "$75,350", delta: "+$850" },
            { label: "Bookings Created", value: "29", delta: "+1" },
            { label: "Opportunities Recovered", value: "29", delta: "+1" },
            { label: "Avg Response Time", value: "6 min", delta: "new" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-xs text-slate-500">{kpi.label}</p>
              <p className="font-bold text-slate-900 text-sm">{kpi.value}</p>
              <p className="text-xs text-green-600 font-medium">{kpi.delta}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function DemoWalkthroughPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  function next() {
    setCompleted((prev) => new Set(Array.from(prev).concat(currentStep)));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function prev() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  function jumpTo(index: number) {
    setCurrentStep(index);
  }

  const step = STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Demo Walkthrough</h1>
        <p className="text-slate-500 text-sm mt-1">
          See how RevenueLeak OS recovers revenue from a missed call in 6 steps
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const SIcon = s.icon;
          const isCompleted = completed.has(i);
          const isCurrent = i === currentStep;

          return (
            <button
              key={s.id}
              onClick={() => jumpTo(i)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0 transition text-sm font-medium",
                isCurrent ? `${s.borderColor} ${s.lightColor} ${s.textColor}` :
                isCompleted ? "border-green-200 bg-green-50 text-green-700" :
                "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              )}
            >
              {isCompleted && !isCurrent ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <SIcon className="h-4 w-4" />
              )}
              <span className="hidden sm:block">{s.title}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Main step view */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Step description */}
        <div className="space-y-4">
          <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold", step.lightColor, step.textColor)}>
            <StepIcon className="h-4 w-4" />
            Step {step.id} of {STEPS.length}
          </div>

          <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">{step.description}</p>

          <div className={cn("rounded-xl p-4 border", step.lightColor, step.borderColor)}>
            <p className="text-sm leading-relaxed" style={{ color: "inherit" }}>
              <span className={cn("font-semibold", step.textColor)}>How it works:</span>{" "}
              <span className="text-slate-600">{step.detail}</span>
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={prev}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button onClick={next} disabled={currentStep === STEPS.length - 1}>
              {currentStep === STEPS.length - 1 ? "Complete" : "Next Step"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mock UI preview */}
        <div className="space-y-4">
          <div className={cn("rounded-2xl border-2 p-4", step.borderColor, step.lightColor)}>
            <p className={cn("text-xs font-semibold uppercase mb-3 flex items-center gap-2", step.textColor)}>
              <Zap className="h-3.5 w-3.5" />
              Live Preview
            </p>
            {step.mockUI}
          </div>
        </div>
      </div>

      {/* All steps summary when on last step */}
      {currentStep === STEPS.length - 1 && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Workflow Complete!</h3>
              <p className="text-green-100">A missed call became an $850 booking — automatically.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: "Response Time", value: "6 min" },
              { label: "Revenue Recovered", value: "$850" },
              { label: "Steps Automated", value: "5 of 6" },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white/10 rounded-xl p-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-green-100 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
