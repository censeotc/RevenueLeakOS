"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { EnrollFollowupButton } from "./EnrollFollowupButton";
import { EstimateDetailPanel } from "./EstimateDetailPanel";
import { demoEstimates } from "@/data/demoData";
import type { EstimateRecord } from "@/types/revenue";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  VIEWED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-slate-100 text-slate-500",
};

export function EstimatesTable() {
  const [selected, setSelected] = useState<EstimateRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Age</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {demoEstimates.map((estimate) => (
              <tr
                key={estimate.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelected(estimate)}
              >
                <td className="px-4 py-3">
                  {estimate.contact ? (
                    <p className="font-medium text-slate-900">
                      {estimate.contact.firstName} {estimate.contact.lastName}
                    </p>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{estimate.title ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[estimate.status] ?? "bg-slate-100 text-slate-500"}`}>
                    {estimate.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  ${estimate.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {formatDistanceToNow(new Date(estimate.createdAt), { addSuffix: true })}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  {(estimate.status === "PENDING" || estimate.status === "VIEWED") && (
                    <EnrollFollowupButton estimateId={estimate.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <EstimateDetailPanel estimate={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
