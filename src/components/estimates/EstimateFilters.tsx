import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function EstimateFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimate filters</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Select defaultValue="All statuses"><option>All statuses</option><option>Stale</option><option>Open</option></Select>
        <Select defaultValue="All service lines"><option>All service lines</option><option>Plumbing</option><option>HVAC</option></Select>
        <Select defaultValue="All owners"><option>All owners</option><option>Avery Lane</option><option>Jamie Cruz</option></Select>
      </CardContent>
    </Card>
  );
}
