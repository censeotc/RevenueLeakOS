import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

export function EstimatedValueCard({ totalValueCents }: { totalValueCents: number }) {
  return (
    <Card>
      <CardHeader><CardTitle>Total addressable value</CardTitle></CardHeader>
      <CardContent><p className="text-3xl font-semibold text-slate-950">{formatCurrency(totalValueCents)}</p></CardContent>
    </Card>
  );
}
