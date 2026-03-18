"use client";

import { Search } from "lucide-react";

export function EstimateFilters() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-[200px] max-w-xs">
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search estimates..."
          className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none w-full"
        />
      </div>

      <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="VIEWED">Viewed</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="DECLINED">Declined</option>
        <option value="EXPIRED">Expired</option>
      </select>

      <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Any amount</option>
        <option value="0-1000">Under $1,000</option>
        <option value="1000-5000">$1,000 – $5,000</option>
        <option value="5000+">$5,000+</option>
      </select>
    </div>
  );
}
