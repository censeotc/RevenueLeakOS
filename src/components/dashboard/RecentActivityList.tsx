import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/types/revenue";

export function RecentActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest actions across operators, campaigns, and imports.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div className="rounded-xl border border-slate-100 p-4" key={item.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-900">{item.title}</p>
              <span className="text-xs text-slate-500">{item.timestamp}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
