"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { OpportunityStatusBadge } from "./OpportunityStatusBadge";
import { OpportunityDetailPanel } from "./OpportunityDetailPanel";
import { demoOpportunities } from "@/data/demoData";
import type { Opportunity } from "@/types/revenue";

export function OpportunityTable() {
  const [selected, setSelected] = useState<Opportunity | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Value</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {demoOpportunities.map((opp) => (
              <tr
                key={opp.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelected(opp)}
              >
                <td className="px-4 py-3">
                  {opp.contact ? (
                    <div>
                      <p className="font-medium text-slate-900">
                        {opp.contact.firstName} {opp.contact.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{opp.contact.phone}</p>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-600 capitalize">{opp.type.replace(/_/g, " ").toLowerCase()}</span>
                </td>
                <td className="px-4 py-3">
                  <OpportunityStatusBadge status={opp.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  ${opp.value.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {formatDistanceToNow(new Date(opp.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <OpportunityDetailPanel opportunity={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
