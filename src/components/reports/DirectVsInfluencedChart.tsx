import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RevenueSummary } from "@/types/revenue";

export function DirectVsInfluencedChart({ summaries }: { summaries: RevenueSummary[] }) {
  const direct = summaries[0]?.amountCents ?? 0;
  const influenced = summaries[1]?.amountCents ?? 0;
  const total = direct + influenced || 1;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Direct vs influenced revenue</CardTitle>
        <CardDescription>How recovered revenue is being attributed in the current period.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex overflow-hidden rounded-full bg-slate-100">
          <div className="h-5 bg-brand-600" style={{ width: `${(direct / total) * 100}%` }} />
          <div className="h-5 bg-slate-300" style={{ width: `${(influenced / total) * 100}%` }} />
        </div>
        <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <p><span className="font-medium text-slate-900">Direct:</span> {summaries[0]?.delta ?? '-'}</p>
          <p><span className="font-medium text-slate-900">Influenced:</span> {summaries[1]?.delta ?? '-'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
