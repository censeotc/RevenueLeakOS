import Image from "next/image";

import { DemoStatePlayer } from "@/components/demo/DemoStatePlayer";
import { TryInteractiveDemoCard } from "@/components/demo/TryInteractiveDemoCard";
import { WorkflowWalkthrough } from "@/components/demo/WorkflowWalkthrough";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { demoStateFrames, walkthroughSteps } from "@/data/walkthroughData";

export default function DemoPage() {
  return (
    <MarketingShell eyebrow="Interactive demo" title="Preview the operator journey from leak detection to attributed revenue." description="This demo view shows how the application structure supports executive visibility, operator action, and post-booking reporting.">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-white">Dashboard preview</CardTitle>
            <CardDescription className="text-slate-300">A static preview stored in the public demo assets folder.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image alt="RevenueLeak OS dashboard preview" className="rounded-2xl border border-white/10" height={420} src="/demo/dashboard-preview.png" width={900} />
          </CardContent>
        </Card>
        <TryInteractiveDemoCard />
      </section>
      <DemoStatePlayer frames={demoStateFrames} />
      <WorkflowWalkthrough steps={walkthroughSteps} />
    </MarketingShell>
  );
}
