import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueSummaryCardsProps {
  directRevenue: number;
  influencedRevenue: number;
  totalRecovered: number;
}

export function RevenueSummaryCards({ directRevenue, influencedRevenue, totalRecovered }: RevenueSummaryCardsProps) {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Direct Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(directRevenue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Influenced Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(influencedRevenue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(totalRecovered)}</p>
        </CardContent>
      </Card>
    </>
  );
}
