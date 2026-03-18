"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QuickActions() {
  const [fromNumber, setFromNumber] = useState("+13135550145");
  const [status, setStatus] = useState<string | null>(null);

  async function simulateMissedCall() {
    setStatus("Running missed-call workflow...");
    const response = await fetch("/api/workflows/missed-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromNumber,
        toNumber: "+13135550111",
        intakeSummary: "Leaking water heater and no hot water.",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Could not run workflow.");
      return;
    }
    setStatus(
      data.suppressed
        ? "Duplicate missed call suppressed (within 4-hour window)."
        : "Missed call captured, opportunity + SMS created.",
    );
  }

  async function launchReactivation() {
    setStatus("Launching reactivation campaign...");
    const response = await fetch("/api/workflows/reactivation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ segment: "no service in 12+ months" }),
    });
    if (!response.ok) {
      setStatus("Unable to launch reactivation campaign.");
      return;
    }
    setStatus("Reactivation campaign launched and opportunities created.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fromNumber">Simulate missed inbound call</Label>
          <Input id="fromNumber" value={fromNumber} onChange={(event) => setFromNumber(event.target.value)} />
          <Button onClick={simulateMissedCall}>Run missed-call workflow</Button>
        </div>
        <div>
          <Button variant="outline" onClick={launchReactivation}>
            Launch reactivation segment
          </Button>
        </div>
        {status ? <p className="text-sm text-slate-600">{status}</p> : null}
      </CardContent>
    </Card>
  );
}
