"use client";

import { useState } from "react";
import {
  Phone,
  MessageSquare,
  Calendar,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  User,
  Clock,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

const STEPS = [
  {
    number: 1,
    title: "Missed Call Arrives",
    icon: Phone,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600",
    ringColor: "ring-red-200",
  },
  {
    number: 2,
    title: "Opportunity Created",
    icon: Target,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    ringColor: "ring-blue-200",
  },
  {
    number: 3,
    title: "Automated SMS Sent",
    icon: MessageSquare,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    ringColor: "ring-indigo-200",
  },
  {
    number: 4,
    title: "Customer Replies",
    icon: MessageSquare,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    ringColor: "ring-emerald-200",
  },
  {
    number: 5,
    title: "Booking Logged",
    icon: Calendar,
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
    ringColor: "ring-violet-200",
  },
  {
    number: 6,
    title: "Dashboard Updates",
    icon: BarChart3,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    ringColor: "ring-amber-200",
  },
] as const;

function StepOne() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        A customer calls your business after hours at 7:42 PM. The call goes
        unanswered.
      </p>

      <div className="mx-auto max-w-sm">
        <Card className="border-2 border-red-200 bg-gradient-to-b from-red-50 to-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                  <Phone className="h-10 w-10 text-red-600 animate-pulse" />
                </div>
                <div className="absolute inset-0 h-20 w-20 animate-ping rounded-full bg-red-200 opacity-30" />
              </div>

              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Incoming Call</p>
                <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Sarah Johnson</span>
                </div>
                <p className="text-sm text-muted-foreground">(248) 555-0142</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="destructive">Missed</Badge>
                <Badge className="bg-orange-100 text-orange-800 border-transparent">
                  <Clock className="mr-1 h-3 w-3" />
                  After Hours
                </Badge>
              </div>

              <div className="w-full rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  7:42 PM &middot; No voicemail left
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepTwo() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        RevenueLeak OS instantly creates a missed_call opportunity and matches
        the caller to an existing contact.
      </p>

      <div className="mx-auto max-w-md">
        <Card className="border-2 border-blue-200 shadow-lg overflow-hidden">
          <div className="bg-blue-500 px-4 py-2">
            <div className="flex items-center gap-2 text-white">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">New Opportunity</span>
              <Badge className="ml-auto bg-white/20 text-white border-transparent text-xs">
                Auto-created
              </Badge>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                Missed call &ndash; furnace not heating
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Customer called about furnace issues, after-hours call missed
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="info" className="mt-1">
                  New
                </Badge>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Estimated Value</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">
                  $450
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-sm font-medium mt-0.5">Sarah Johnson</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium mt-0.5">missed_call</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
              <Sparkles className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="text-blue-700">
                Contact matched: Sarah Johnson &middot; (248) 555-0142
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepThree() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Within 60 seconds, an automated SMS is sent to the caller using your
        approved template.
      </p>

      <div className="mx-auto max-w-sm">
        <Card className="border shadow-lg overflow-hidden">
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">Messages</span>
            <span className="text-xs text-gray-400">Sarah Johnson</span>
          </div>
          <CardContent className="p-4 bg-gray-50 min-h-[200px] flex flex-col justify-end">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-500 px-4 py-3 text-white shadow-sm">
                <p className="text-sm leading-relaxed">
                  Hi Sarah, we noticed we missed your call at North Shore
                  Heating &amp; Plumbing. We&apos;d love to help! Reply YES to
                  schedule a callback or call us at (248) 555-1000.
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-1">
              <p className="text-[10px] text-muted-foreground">
                Delivered &middot; 7:43 PM
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-lg border bg-white p-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Sent automatically &middot; 60 seconds after missed call</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepFour() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        The customer responds, converting the opportunity from
        &ldquo;new&rdquo; to &ldquo;responded&rdquo;.
      </p>

      <div className="mx-auto max-w-sm">
        <Card className="border shadow-lg overflow-hidden">
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">Messages</span>
            <span className="text-xs text-gray-400">Sarah Johnson</span>
          </div>
          <CardContent className="p-4 bg-gray-50 space-y-3 min-h-[240px] flex flex-col justify-end">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-500 px-4 py-3 text-white shadow-sm">
                <p className="text-sm leading-relaxed">
                  Hi Sarah, we noticed we missed your call at North Shore
                  Heating &amp; Plumbing. We&apos;d love to help! Reply YES to
                  schedule a callback or call us at (248) 555-1000.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <p className="text-[10px] text-muted-foreground">
                Delivered &middot; 7:43 PM
              </p>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-gray-200 px-4 py-3 shadow-sm">
                <p className="text-sm leading-relaxed">
                  YES &ndash; my furnace stopped working and it&apos;s really
                  cold. Can someone come tomorrow morning?
                </p>
              </div>
            </div>
            <div className="flex justify-start">
              <p className="text-[10px] text-muted-foreground">
                Received &middot; 7:48 PM
              </p>
            </div>

            <div className="mt-2 flex items-center justify-center gap-3">
              <Badge variant="secondary" className="line-through opacity-60">
                New
              </Badge>
              <ArrowRight className="h-4 w-4 text-emerald-500" />
              <Badge variant="success">Responded</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepFive() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Your team confirms the appointment and logs the booking. Revenue is
        attributed to the missed-call recovery workflow.
      </p>

      <div className="mx-auto max-w-md">
        <Card className="border-2 border-violet-200 shadow-lg overflow-hidden">
          <div className="bg-violet-500 px-4 py-2">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Booking Confirmed</span>
              <CheckCircle2 className="ml-auto h-4 w-4" />
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Furnace Repair</h3>
              <p className="text-sm text-muted-foreground">Sarah Johnson</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <Calendar className="h-5 w-5 mx-auto text-violet-500" />
                <p className="text-xs text-muted-foreground mt-1">Date</p>
                <p className="text-sm font-medium">Tomorrow</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <Clock className="h-5 w-5 mx-auto text-violet-500" />
                <p className="text-xs text-muted-foreground mt-1">Time</p>
                <p className="text-sm font-medium">9:00 AM</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <DollarSign className="h-5 w-5 mx-auto text-emerald-500" />
                <p className="text-xs text-muted-foreground mt-1">Value</p>
                <p className="text-sm font-bold text-emerald-600">$450</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Badge variant="secondary" className="line-through opacity-60">
                Responded
              </Badge>
              <ArrowRight className="h-4 w-4 text-violet-500" />
              <Badge className="bg-violet-100 text-violet-800 border-transparent">
                Booked
              </Badge>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm">
              <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />
              <span className="text-violet-700">
                Revenue attributed to Missed Call Recovery workflow
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepSix() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        The dashboard reflects the recovered revenue in real-time. This booking
        is attributed as direct revenue from the missed-call workflow.
      </p>

      <div className="mx-auto max-w-lg">
        <Card className="border-2 border-amber-200 shadow-lg overflow-hidden">
          <div className="bg-amber-500 px-4 py-2">
            <div className="flex items-center gap-2 text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard Updated</span>
              <Badge className="ml-auto bg-white/20 text-white border-transparent text-xs">
                Real-time
              </Badge>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto text-emerald-500" />
                <p className="text-xs text-muted-foreground mt-2">Revenue</p>
                <p className="text-xl font-bold text-emerald-600">+$450</p>
                <div className="mt-1 flex items-center justify-center gap-1 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Recovered</span>
                </div>
              </div>
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto text-blue-500" />
                <p className="text-xs text-muted-foreground mt-2">Bookings</p>
                <p className="text-xl font-bold text-blue-600">+1</p>
                <div className="mt-1 flex items-center justify-center gap-1 text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">This week</span>
                </div>
              </div>
              <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-4 text-center">
                <Target className="h-6 w-6 mx-auto text-violet-500" />
                <p className="text-xs text-muted-foreground mt-2">
                  Recovery Rate
                </p>
                <p className="text-xl font-bold text-violet-600">+2.3%</p>
                <div className="mt-1 flex items-center justify-center gap-1 text-violet-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Improving</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Missed Call Recovery Rate
                </span>
                <span className="font-semibold">42%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000"
                  style={{ width: "42%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                19 of 45 missed calls recovered this month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const STEP_COMPONENTS = [
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
  StepSix,
];

export default function DemoWalkthroughPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];
  const StepContent = STEP_COMPONENTS[currentStep];
  const Icon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Tour"
        description="See how RevenueLeak OS recovers revenue for your business"
      />

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((s, i) => {
          const SIcon = s.icon;
          const isActive = i === currentStep;
          const isPast = i < currentStep;
          return (
            <button
              key={s.number}
              onClick={() => setCurrentStep(i)}
              className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                isActive
                  ? `${s.color} text-white shadow-md`
                  : isPast
                    ? "bg-muted text-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <SIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{s.number}</span>
              {isPast && (
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="transition-all duration-500">
        <Card className={`mx-auto max-w-2xl ring-2 ${step.ringColor}`}>
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${step.color} text-white`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Step {step.number} of {STEPS.length}
                </p>
                <h2 className="text-xl font-bold">{step.title}</h2>
              </div>
            </div>

            <StepContent />
          </CardContent>
        </Card>
      </div>

      {/* Step Dots */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentStep
                ? `w-8 ${STEPS[i].color}`
                : i < currentStep
                  ? "w-2.5 bg-primary/40"
                  : "w-2.5 bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mx-auto max-w-2xl">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={isFirst}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {isFirst ? (
          <Button onClick={() => setCurrentStep(1)}>
            Start Tour
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : isLast ? (
          <Button asChild>
            <a href="/app/dashboard">
              Back to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button onClick={() => setCurrentStep((s) => s + 1)}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
