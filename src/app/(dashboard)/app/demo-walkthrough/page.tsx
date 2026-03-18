import { DemoStatePlayer } from "@/components/demo/DemoStatePlayer";
import { TryInteractiveDemoCard } from "@/components/demo/TryInteractiveDemoCard";
import { WorkflowWalkthrough } from "@/components/demo/WorkflowWalkthrough";
import { PageHeading } from "@/components/shared/PageHeading";
import { demoStateFrames, walkthroughSteps } from "@/data/walkthroughData";

export default function DemoWalkthroughPage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Demo walkthrough" title="Play through the product story inside the application shell" description="Use this route to review the end-to-end narrative before wiring real backend workflows and event streams." />
      <WorkflowWalkthrough steps={walkthroughSteps} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DemoStatePlayer frames={demoStateFrames} />
        <TryInteractiveDemoCard />
      </div>
    </div>
  );
}
