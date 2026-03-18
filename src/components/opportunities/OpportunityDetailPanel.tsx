import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { Opportunity } from "@/types/revenue";

export function OpportunityDetailPanel({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{opportunity.title}</CardTitle>
        <CardDescription>{opportunity.source}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p><span className="font-medium text-slate-900">Contact:</span> {opportunity.contactName}</p>
        <p><span className="font-medium text-slate-900">Priority:</span> {opportunity.priority}</p>
        <p><span className="font-medium text-slate-900">Projected value:</span> {formatCurrency(opportunity.valueCents)}</p>
        <p><span className="font-medium text-slate-900">Next action:</span> {opportunity.nextAction}</p>
      </CardContent>
    </Card>
  );
}
