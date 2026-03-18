import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EstimatedValueCardProps {
  value: number;
  contactCount: number;
}

export function EstimatedValueCard({ value, contactCount }: EstimatedValueCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Estimated Recoverable Value</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{formatCurrency(value)}</p>
        <p className="text-sm text-muted-foreground">from {contactCount} contacts</p>
      </CardContent>
    </Card>
  );
}
