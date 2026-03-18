import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BusinessProfile } from "@/types/revenue";

export function AttributionRulesForm({ profile }: { profile: BusinessProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attribution rules</CardTitle>
        <CardDescription>Adjust windows and thresholds used in reporting.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Input defaultValue={String(profile.attributionWindowDays)} />
        <Input defaultValue={String(profile.highValueThreshold)} />
        <Input defaultValue={String(profile.duplicateMissedCallWindowHours)} />
      </CardContent>
    </Card>
  );
}
