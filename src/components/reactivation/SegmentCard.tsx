import type { ReactivationSegment } from "@/types/revenue";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SegmentCardProps {
  segment: ReactivationSegment;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function SegmentCard({ segment, selected, onSelect }: SegmentCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-shadow hover:shadow-md ${selected ? "ring-2 ring-primary" : ""}`}
      onClick={() => onSelect?.(segment.id)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{segment.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{segment.count}</p>
        <p className="text-sm text-muted-foreground">customers</p>
        <p className="mt-2 text-sm font-medium">{formatCurrency(segment.estimatedValue)}</p>
        <p className="text-xs text-muted-foreground">estimated value</p>
      </CardContent>
    </Card>
  );
}
