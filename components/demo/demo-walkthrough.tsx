"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Missed call arrives",
  "Opportunity created",
  "SMS sent",
  "Contact replies",
  "Booking logged",
  "Dashboard updates",
];

export function DemoWalkthrough() {
  const [opportunityId, setOpportunityId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  async function startFlow() {
    const response = await fetch("/api/workflows/missed-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromNumber: "+13135550999",
        toNumber: "+13135550111",
        intakeSummary: "Demo walkthrough missed call",
      }),
    });
    if (!response.ok) {
      setMessage("Could not start walkthrough.");
      return;
    }
    const data = await response.json();
    setOpportunityId(data.opportunityId ?? null);
    setCurrentStep(2);
    setMessage("Missed call captured and first SMS sent.");
  }

  async function simulateReply() {
    if (!opportunityId) return;
    const response = await fetch("/api/workflows/missed-call/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunityId,
        reply: "Yes, I need someone today.",
      }),
    });
    if (!response.ok) {
      setMessage("Could not simulate reply.");
      return;
    }
    setCurrentStep(4);
    setMessage("Inbound reply captured, opportunity marked responded.");
  }

  async function logBooking() {
    if (!opportunityId) return;
    const response = await fetch("/api/workflows/missed-call/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunityId,
        revenue: 2200,
        serviceType: "Emergency repair",
      }),
    });
    if (!response.ok) {
      setMessage("Could not log booking.");
      return;
    }
    setCurrentStep(6);
    setMessage("Booking logged. Dashboard and reporting metrics now reflect recovered revenue.");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RevenueLeak OS product tour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            This walkthrough simulates the full missed-call recovery lifecycle using live mock
            services and opportunity updates.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={startFlow}>1-3: Start missed-call flow</Button>
            <Button variant="outline" onClick={simulateReply} disabled={!opportunityId}>
              4: Simulate reply
            </Button>
            <Button variant="outline" onClick={logBooking} disabled={!opportunityId}>
              5-6: Log booking + update dashboard
            </Button>
          </div>
          {message ? <p className="text-sm text-slate-700">{message}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step} className={index < currentStep ? "border-emerald-300 bg-emerald-50" : undefined}>
            <CardHeader>
              <CardTitle className="text-base">
                Step {index + 1}: {step}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                {index < currentStep
                  ? "Completed in walkthrough state."
                  : "Pending in walkthrough state."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
