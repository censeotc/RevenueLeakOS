"use client";

import { useState } from "react";

export function AttributionRulesForm() {
  const [window, setWindow] = useState("30");
  const [model, setModel] = useState("last_touch");

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Attribution Rules</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="attr-window" className="text-sm font-medium">Attribution window (days)</label>
          <input
            id="attr-window"
            type="number"
            value={window}
            onChange={(e) => setWindow(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="attr-model" className="text-sm font-medium">Attribution model</label>
          <select
            id="attr-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="last_touch">Last Touch</option>
            <option value="first_touch">First Touch</option>
            <option value="linear">Linear</option>
          </select>
        </div>
      </div>
      <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Save Rules
      </button>
    </div>
  );
}
