"use client";

import { Search } from "lucide-react";

export function OpportunityFilters() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-[200px] max-w-xs">
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search opportunities..."
          className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none w-full"
        />
      </div>

      <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="WON">Won</option>
        <option value="LOST">Lost</option>
        <option value="DISMISSED">Dismissed</option>
      </select>

      <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All types</option>
        <option value="MISSED_CALL">Missed Call</option>
        <option value="UNANSWERED_ESTIMATE">Unanswered Estimate</option>
        <option value="REACTIVATION">Reactivation</option>
        <option value="FOLLOW_UP">Follow Up</option>
      </select>
    </div>
  );
}
