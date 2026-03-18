"use client";

import { useState, useRef } from "react";
import {
  Building2,
  Phone,
  Upload,
  Settings,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Link2,
  FileSpreadsheet,
  Briefcase,
  PhoneCall,
  Zap,
  PartyPopper,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ONBOARDING_STEPS = [
  { number: 1, title: "Business Profile", icon: Building2 },
  { number: 2, title: "Connect Phone", icon: Phone },
  { number: 3, title: "Import Contacts", icon: Upload },
  { number: 4, title: "Configure Workflows", icon: Settings },
] as const;

const INDUSTRIES = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "multi_trade", label: "Multi-Trade" },
  { value: "other", label: "Other" },
];

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Detroit", label: "Detroit (ET)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HST)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
];

function StepBusinessProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Business Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about your business so we can customize your experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            placeholder="e.g. North Shore Heating & Plumbing"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Business Phone Number</Label>
          <Input id="phone" type="tel" placeholder="(248) 555-1000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select>
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function StepConnectPhone() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  function handleConnect() {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Connect Your Phone</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your phone system to automatically detect missed calls and
          send follow-up messages.
        </p>
      </div>

      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Twilio</h3>
              <p className="text-sm text-muted-foreground mt-1">
                SMS messaging and call tracking
              </p>
            </div>

            {connected ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <Button onClick={handleConnect} disabled={connecting}>
                {connecting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Connect Twilio
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <h4 className="text-sm font-medium">Why connect your phone?</h4>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <PhoneCall className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
            Automatically detect missed calls in real-time
          </li>
          <li className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
            Send automated follow-up SMS to recover missed opportunities
          </li>
          <li className="flex items-start gap-2">
            <Zap className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
            Track response rates and attribute revenue to recovery workflows
          </li>
        </ul>
      </div>

      <div className="text-center">
        <button className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
          Skip &ndash; I&apos;ll set this up later
        </button>
      </div>
    </div>
  );
}

function StepImportContacts() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Import Contacts</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Import your existing customers and leads to start recovering revenue
          immediately.
        </p>
      </div>

      <div className="grid gap-3">
        <Card
          className="border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Import from CSV</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a spreadsheet with your contacts
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </div>
          </CardContent>
        </Card>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
        />

        <Card className="border opacity-60">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Import from Jobber</h3>
                <p className="text-sm text-muted-foreground">
                  Sync your Jobber contacts automatically
                </p>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border opacity-60">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Import from ServiceTitan</h3>
                <p className="text-sm text-muted-foreground">
                  Sync your ServiceTitan customer list
                </p>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <button className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
          Skip &ndash; start with demo data
        </button>
      </div>
    </div>
  );
}

function StepConfigureWorkflows() {
  const [missedCall, setMissedCall] = useState(true);
  const [estimateFollowup, setEstimateFollowup] = useState(true);
  const [reactivation, setReactivation] = useState(false);

  const workflows = [
    {
      id: "missed-call",
      title: "Missed Call Recovery",
      description:
        "Automatically send follow-up SMS when a call goes unanswered. Recovers revenue from after-hours and busy-period missed calls.",
      enabled: missedCall,
      onToggle: setMissedCall,
      icon: PhoneCall,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "estimate-followup",
      title: "Estimate Follow-up",
      description:
        "Automatically follow up on stale estimates that haven't received a response. Reminds customers before quotes expire.",
      enabled: estimateFollowup,
      onToggle: setEstimateFollowup,
      icon: FileSpreadsheet,
      color: "bg-violet-100 text-violet-600",
    },
    {
      id: "reactivation",
      title: "Customer Reactivation",
      description:
        "Re-engage dormant customers who haven't booked service in 12+ months. Great for seasonal maintenance campaigns.",
      enabled: reactivation,
      onToggle: setReactivation,
      icon: Zap,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Configure Workflows</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which automated recovery workflows to enable. You can change
          these anytime in Settings.
        </p>
      </div>

      <div className="space-y-3">
        {workflows.map((wf) => {
          const WfIcon = wf.icon;
          return (
            <Card
              key={wf.id}
              className={`transition-all duration-200 ${wf.enabled ? "ring-2 ring-primary/20 border-primary/30" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${wf.color}`}
                  >
                    <WfIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold">{wf.title}</h3>
                      <Switch
                        checked={wf.enabled}
                        onCheckedChange={wf.onToggle}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {wf.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function CompletionScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 space-y-6 relative overflow-hidden">
      {/* Confetti-like decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-[10%] h-3 w-3 rotate-45 bg-blue-400 rounded-sm opacity-60 animate-bounce" style={{ animationDelay: "0s", animationDuration: "2.5s" }} />
        <div className="absolute top-8 left-[25%] h-2 w-4 bg-emerald-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: "0.3s", animationDuration: "3s" }} />
        <div className="absolute top-2 left-[40%] h-3 w-3 rotate-12 bg-violet-400 rounded-sm opacity-60 animate-bounce" style={{ animationDelay: "0.6s", animationDuration: "2.8s" }} />
        <div className="absolute top-10 right-[35%] h-2 w-2 bg-amber-400 rounded-full opacity-70 animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "2.6s" }} />
        <div className="absolute top-4 right-[20%] h-3 w-3 -rotate-12 bg-rose-400 rounded-sm opacity-50 animate-bounce" style={{ animationDelay: "0.8s", animationDuration: "3.2s" }} />
        <div className="absolute top-6 right-[10%] h-2 w-4 bg-cyan-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "2.4s" }} />
        <div className="absolute top-16 left-[15%] h-2 w-2 bg-pink-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: "1s", animationDuration: "2.7s" }} />
        <div className="absolute top-14 right-[25%] h-3 w-3 rotate-45 bg-indigo-400 rounded-sm opacity-40 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "3.1s" }} />
      </div>

      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <PartyPopper className="h-10 w-10 text-emerald-600" />
        </div>
        <div className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
          <Sparkles className="h-4 w-4 text-amber-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your workspace is configured and ready to start recovering revenue.
          Head to the dashboard to see your first insights.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
          <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500" />
          <p className="text-xs text-muted-foreground mt-1">Profile</p>
        </div>
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
          <CheckCircle2 className="h-5 w-5 mx-auto text-blue-500" />
          <p className="text-xs text-muted-foreground mt-1">Phone</p>
        </div>
        <div className="rounded-lg bg-violet-50 border border-violet-200 p-3 text-center">
          <CheckCircle2 className="h-5 w-5 mx-auto text-violet-500" />
          <p className="text-xs text-muted-foreground mt-1">Workflows</p>
        </div>
      </div>

      <Button size="lg" asChild>
        <a href="/app/dashboard">
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}

const STEP_COMPONENTS = [
  StepBusinessProfile,
  StepConnectPhone,
  StepImportContacts,
  StepConfigureWorkflows,
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const totalSteps = ONBOARDING_STEPS.length;

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  }

  function handlePrev() {
    if (completed) {
      setCompleted(false);
    } else {
      setCurrentStep((s) => Math.max(0, s - 1));
    }
  }

  const progressPercent = completed
    ? 100
    : ((currentStep + 1) / totalSteps) * 100;

  if (completed) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to RevenueLeak OS
          </h1>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Setup Complete</span>
            <span>4 of 4</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <CompletionScreen />
          </CardContent>
        </Card>
      </div>
    );
  }

  const StepContent = STEP_COMPONENTS[currentStep];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to RevenueLeak OS
        </h1>
        <p className="text-sm text-muted-foreground">
          Let&apos;s get your workspace set up in a few minutes
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-6">
        {ONBOARDING_STEPS.map((step, i) => {
          const SIcon = step.icon;
          const isActive = i === currentStep;
          const isPast = i < currentStep;
          return (
            <div key={step.number} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : isPast
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <SIcon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <StepContent />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext}>
          {currentStep === totalSteps - 1 ? "Complete Setup" : "Next"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
