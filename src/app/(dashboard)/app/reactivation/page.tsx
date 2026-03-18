import type { Metadata } from "next";
import { SegmentCard } from "@/components/reactivation/SegmentCard";
import { EstimatedValueCard } from "@/components/reactivation/EstimatedValueCard";
import { reactivationSegments } from "@/data/demoData";

export const metadata: Metadata = { title: "Reactivation" };

export default function ReactivationPage() {
  const totalValue = reactivationSegments.reduce((sum, s) => sum + s.estimatedValue, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Reactivation</h1>
          <p className="text-slate-500 text-sm mt-0.5">Re-engage dormant customers with targeted campaigns</p>
        </div>
        <EstimatedValueCard value={totalValue} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {reactivationSegments.map((segment) => (
          <SegmentCard key={segment.id} segment={segment} />
        ))}
      </div>
    </div>
  );
}
