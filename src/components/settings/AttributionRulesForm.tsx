"use client";

import { useState } from "react";

export function AttributionRulesForm() {
  const [windowDays, setWindowDays] = useState(30);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await new Promise((r) => setTimeout(r, 400));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Attribution window
          <span className="text-slate-400 font-normal ml-1">(days)</span>
        </label>
        <p className="text-xs text-slate-500 mb-2">
          How many days after a touchpoint can a conversion be attributed to RevenueLeakOS.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={90}
            value={windowDays}
            onChange={(e) => setWindowDays(parseInt(e.target.value, 10))}
            className="w-48"
          />
          <span className="text-sm font-semibold text-slate-900 w-16">{windowDays} days</span>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input type="checkbox" id="auto-enroll" defaultChecked className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600" />
        <div>
          <label htmlFor="auto-enroll" className="text-sm font-medium text-slate-700">
            Auto-enroll new estimates in follow-up sequence
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatically enroll estimates in your default follow-up campaign when they're created.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
