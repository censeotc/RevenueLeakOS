"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Building2, Phone, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
  { id: 1, title: "Business Info", description: "Tell us about your company" },
  { id: 2, title: "Service Types", description: "What services do you offer?" },
  { id: 3, title: "Communication", description: "Set up your messaging" },
  { id: 4, title: "Ready!", description: "Start recovering revenue" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleComplete = () => {
    window.location.assign("/demo/login?next=/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-border bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">RevenueLeak OS</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-4 h-px w-8 sm:w-16 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="text-center mb-6">
                    <Building2 className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h2 className="text-xl font-semibold">Business Information</h2>
                    <p className="text-sm text-muted-foreground">Let&apos;s get your company set up</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium block mb-1">Business Name</label>
                      <input className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background" placeholder="Acme Heating & Plumbing" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Phone</label>
                      <input className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background" placeholder="(555) 555-5555" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Email</label>
                      <input className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background" placeholder="office@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">City</label>
                      <input className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background" placeholder="Detroit" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">State</label>
                      <input className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-background" placeholder="MI" />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">What services do you offer?</h2>
                    <p className="text-sm text-muted-foreground">Select all that apply</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["HVAC", "Plumbing", "Electrical", "Heating", "Cooling", "Water Heaters", "Drain Cleaning", "Duct Work", "Maintenance Plans", "Emergency Service"].map((service) => (
                      <label key={service} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm font-medium">{service}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="text-center mb-6">
                    <Phone className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h2 className="text-xl font-semibold">Communication Setup</h2>
                    <p className="text-sm text-muted-foreground">Configure how you&apos;ll reach customers</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Auto-reply to missed calls</p>
                        <p className="text-xs text-muted-foreground">Send an SMS when a call is missed</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Stale estimate alerts</p>
                        <p className="text-xs text-muted-foreground">Get notified when estimates go stale (7+ days)</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Reactivation campaigns</p>
                        <p className="text-xs text-muted-foreground">Automatically identify dormant customers</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">You&apos;re all set!</h2>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    Your RevenueLeak OS account is ready. Start recovering revenue from missed calls, stale estimates, and dormant customers.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {currentStep < 4 ? (
                  <Button onClick={() => setCurrentStep((s) => s + 1)}>
                    Continue <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleComplete}>
                    Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
