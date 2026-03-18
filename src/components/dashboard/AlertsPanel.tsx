import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { AlertItem } from "@/types/revenue";

interface AlertsPanelProps {
  alerts: AlertItem[];
}

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  warning: "text-orange-500 bg-orange-50 border-orange-100",
  info: "text-blue-500 bg-blue-50 border-blue-100",
  success: "text-green-500 bg-green-50 border-green-100",
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-900">Alerts</h3>
      </div>
      <ul className="p-3 space-y-2">
        {alerts.map((alert) => {
          const Icon = iconMap[alert.severity];
          return (
            <li
              key={alert.id}
              className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm ${colorMap[alert.severity]}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{alert.title}</p>
                {alert.description && (
                  <p className="text-xs opacity-80 mt-0.5">{alert.description}</p>
                )}
              </div>
            </li>
          );
        })}
        {alerts.length === 0 && (
          <li className="text-center py-4 text-sm text-slate-400">No alerts right now</li>
        )}
      </ul>
    </div>
  );
}
