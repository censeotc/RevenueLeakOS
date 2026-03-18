import type { RecentActivity } from "@/types/revenue";
import { formatRelativeDate } from "@/lib/formatters";

interface RecentActivityListProps {
  activities: RecentActivity[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 text-sm">
            <div className="flex-1">
              <p>{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
