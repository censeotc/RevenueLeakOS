"use client";

import Link from "next/link";
import { Plus, Upload, Phone } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/app/contacts?import=true"
        className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <Upload className="h-3.5 w-3.5" />
        Import
      </Link>
      <Link
        href="/app/campaigns?new=true"
        className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Campaign
      </Link>
      <button className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
        <Phone className="h-3.5 w-3.5" />
        Log Call
      </button>
    </div>
  );
}
