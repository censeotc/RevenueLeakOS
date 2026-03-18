import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function OpportunityFilters({ filterSummary }: { filterSummary: { pipeline: string; owner: string; timeframe: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Input defaultValue={filterSummary.pipeline} placeholder="Pipeline" />
        <Select defaultValue={filterSummary.owner}>
          <option>{filterSummary.owner}</option>
          <option>Jamie Cruz</option>
          <option>Avery Lane</option>
        </Select>
        <Select defaultValue={filterSummary.timeframe}>
          <option>{filterSummary.timeframe}</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </Select>
      </CardContent>
    </Card>
  );
}
