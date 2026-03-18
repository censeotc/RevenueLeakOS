import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { ReactivationSegment } from "@/types/revenue";

export function SegmentCard({ segment }: { segment: ReactivationSegment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{segment.name}</CardTitle>
        <CardDescription>{segment.reason}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p><span className="font-medium text-slate-900">Audience:</span> {formatNumber(segment.audienceSize)}</p>
        <p><span className="font-medium text-slate-900">Estimated value:</span> {formatCurrency(segment.estimatedValueCents)}</p>
      </CardContent>
    </Card>
  );
}
