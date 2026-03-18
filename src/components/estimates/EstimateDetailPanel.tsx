import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { EstimateRecord } from "@/types/revenue";

export function EstimateDetailPanel({ estimate }: { estimate: EstimateRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{estimate.number}</CardTitle>
        <CardDescription>{estimate.customer}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p><span className="font-medium text-slate-900">Service:</span> {estimate.serviceType}</p>
        <p><span className="font-medium text-slate-900">Amount:</span> {formatCurrency(estimate.amountCents)}</p>
        <p><span className="font-medium text-slate-900">Sent:</span> {estimate.sentAt}</p>
        <p><span className="font-medium text-slate-900">Follow-up enrolled:</span> {estimate.enrolledInFollowUp ? 'Yes' : 'No'}</p>
      </CardContent>
    </Card>
  );
}
