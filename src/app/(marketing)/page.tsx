import Link from "next/link";

import { WorkflowWalkthrough } from "@/components/demo/WorkflowWalkthrough";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardKpis } from "@/data/dashboardData";
import { walkthroughSteps } from "@/data/walkthroughData";
import { PRICING_TIERS } from "@/lib/constants";

export default function MarketingHomePage() {
  return (
    <MarketingShell
      eyebrow="Revenue recovery operating system"
      title="Recover booked revenue before it leaks out of the pipeline."
      description="Coordinate call capture, estimate rescue, customer reactivation, and attribution reporting from one operating system built for home-service teams."
    >
      <section className="grid gap-4 md:grid-cols-4">
        {dashboardKpis.map((metric) => (
          <Card className="border-white/10 bg-white/5 text-white" key={metric.label}>
            <CardHeader>
              <CardDescription className="text-slate-300">{metric.label}</CardDescription>
              <CardTitle className="text-3xl text-white">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-brand-100">{metric.change}</CardContent>
          </Card>
        ))}
      </section>
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">How the system works</h2>
            <p className="text-sm text-slate-300">Bring fragmented recovery work into a single operating rhythm.</p>
          </div>
          <Link href="/demo"><Button variant="outline">See the demo</Button></Link>
        </div>
        <WorkflowWalkthrough steps={walkthroughSteps} />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <Card className="border-white/10 bg-white/5 text-white" key={tier.name}>
            <CardHeader>
              <CardTitle className="text-white">{tier.name}</CardTitle>
              <CardDescription className="text-slate-300">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-200">
              <p className="text-2xl font-semibold text-white">{tier.price}</p>
              <ul className="space-y-2">{tier.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </MarketingShell>
  );
}
