import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {subtext ? <p className="mt-1 text-xs text-slate-500">{subtext}</p> : null}
      </CardContent>
    </Card>
  );
}
