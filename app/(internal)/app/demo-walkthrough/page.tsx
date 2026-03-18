import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { DemoWalkthrough } from "@/components/demo/demo-walkthrough";

export default async function DemoWalkthroughPage() {
  await requireAppPath("/app/demo-walkthrough");

  return (
    <div>
      <PageHeader
        title="Demo Walkthrough"
        description="Interactive internal tour showing missed-call recovery from intake to booked revenue."
      />
      <DemoWalkthrough />
    </div>
  );
}
