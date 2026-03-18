"use client";

import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toAppRoute } from "@/lib/app-routes";

const steps = [
  {
    id: "dashboard",
    title: "Review your recovery dashboard",
    description: "Check active alerts and at-risk opportunities.",
    href: toAppRoute("/dashboard"),
  },
  {
    id: "calls",
    title: "Run missed call recovery",
    description: "Open Calls and send a mock SMS or callback from the detail panel.",
    href: toAppRoute("/calls"),
  },
  {
    id: "estimates",
    title: "Enroll stale estimates",
    description: "Identify stale estimates and enroll them into follow-up.",
    href: toAppRoute("/estimates"),
  },
  {
    id: "reactivation",
    title: "Launch a reactivation segment",
    description: "Preview dormant customers and launch a campaign.",
    href: toAppRoute("/reactivation"),
  },
  {
    id: "imports",
    title: "Preview CSV import scaffold",
    description: "Upload contacts/estimates CSV and validate required columns.",
    href: toAppRoute("/imports"),
  },
];

export default function WalkthroughPage() {
  return (
    <div>
      <TopBar title="Demo Walkthrough" />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              Pilot Readiness Walkthrough
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Use this sequence to validate internal workflows before pilot calls.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-start justify-between rounded-lg border border-border bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 text-primary">
                    {index === 0 ? (
                      <Circle className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <Link href={step.href}>
                  <Button size="sm" variant="outline">
                    Open
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
