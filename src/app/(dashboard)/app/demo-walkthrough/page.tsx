import type { Metadata } from "next";
import { WorkflowWalkthrough } from "@/components/demo/WorkflowWalkthrough";

export const metadata: Metadata = { title: "Demo Walkthrough" };

export default function DemoWalkthroughPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Demo Walkthrough</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Step through a simulated revenue recovery scenario
        </p>
      </div>
      <WorkflowWalkthrough />
    </div>
  );
}
