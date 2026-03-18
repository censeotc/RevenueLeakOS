import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CallRecord } from "@/types/revenue";

export function CallDetailPanel({ call }: { call: CallRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{call.caller}</CardTitle>
        <CardDescription>{call.phone}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p><span className="font-medium text-slate-900">Disposition:</span> {call.disposition}</p>
        <p><span className="font-medium text-slate-900">Started:</span> {call.startTime}</p>
        <p><span className="font-medium text-slate-900">Summary:</span> {call.summary}</p>
      </CardContent>
    </Card>
  );
}
