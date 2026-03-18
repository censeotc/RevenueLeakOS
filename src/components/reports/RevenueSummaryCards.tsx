import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { RevenueSummary } from "@/types/revenue";

export function RevenueSummaryCards({ summaries }: { summaries: RevenueSummary[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaries.map((summary) => (
        <Card key={summary.label}>
          <CardHeader>
            <CardDescription>{summary.label}</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(summary.amountCents)}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-sm text-emerald-600">{summary.delta}</p></CardContent>
        </Card>
      ))}
    </div>
  );
}
