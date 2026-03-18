"use client";

import { useState } from "react";

const notifications = [
  { id: "new_opportunity", label: "New opportunity detected", description: "When a missed call or unanswered estimate is found" },
  { id: "opportunity_won", label: "Opportunity won", description: "When an opportunity is marked as recovered" },
  { id: "campaign_enrolled", label: "Contact enrolled in campaign", description: "When a contact is enrolled in any campaign" },
  { id: "integration_error", label: "Integration errors", description: "When a connected integration has a sync issue" },
  { id: "weekly_summary", label: "Weekly revenue summary", description: "A recap of recovered revenue every Monday" },
];

export function NotificationSettingsForm() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(notifications.map((n) => [n.id, true]))
  );

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start gap-3">
          <button
            onClick={() => setEnabled((prev) => ({ ...prev, [notification.id]: !prev[notification.id] }))}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 mt-0.5 ${
              enabled[notification.id] ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                enabled[notification.id] ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <div>
            <p className="text-sm font-medium text-slate-900">{notification.label}</p>
            <p className="text-xs text-slate-500">{notification.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
