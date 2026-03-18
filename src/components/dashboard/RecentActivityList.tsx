import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/types/revenue";

interface RecentActivityListProps {
  items: ActivityItem[];
}

const typeColors: Record<string, string> = {
  won: "bg-green-100 text-green-700",
  missed_call: "bg-orange-100 text-orange-700",
  estimate_sent: "bg-blue-100 text-blue-700",
  follow_up: "bg-purple-100 text-purple-700",
  reactivation: "bg-teal-100 text-teal-700",
};

export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
      </div>
      <ul className="divide-y divide-slate-50">
        {items.slice(0, 8).map((item) => (
          <li key={item.id} className="px-4 py-3 flex items-start gap-3">
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${typeColors[item.type] ?? "bg-slate-100 text-slate-600"}`}>
              {item.type.replace(/_/g, " ")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800">{item.description}</p>
              {item.contactName && (
                <p className="text-xs text-slate-400">{item.contactName}</p>
              )}
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
