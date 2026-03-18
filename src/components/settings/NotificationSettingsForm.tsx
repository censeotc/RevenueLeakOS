"use client";

import { useState } from "react";

export function NotificationSettingsForm() {
  const [missedCall, setMissedCall] = useState(true);
  const [newOpportunity, setNewOpportunity] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Notification Settings</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={missedCall}
            onChange={(e) => setMissedCall(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm">Notify on missed calls</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={newOpportunity}
            onChange={(e) => setNewOpportunity(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm">Notify on new opportunities</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={weeklyDigest}
            onChange={(e) => setWeeklyDigest(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm">Weekly email digest</span>
        </label>
      </div>
      <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Save Preferences
      </button>
    </div>
  );
}
