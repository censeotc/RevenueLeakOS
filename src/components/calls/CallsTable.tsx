"use client";

import { formatDistanceToNow } from "date-fns";
import { Phone, MessageSquare, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { CallRecord } from "@/types/revenue";
import { demoCalls } from "@/data/demoData";

export function CallsTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Duration</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {demoCalls.map((call) => (
            <tr key={call.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {call.type === "VOICE" ? (
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  {call.direction === "INBOUND" ? (
                    <ArrowDownLeft className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3 text-blue-500" />
                  )}
                  <span className="text-slate-600 capitalize">{call.type.toLowerCase()}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {call.contactName ? (
                  <div>
                    <p className="font-medium text-slate-900">{call.contactName}</p>
                    <p className="text-xs text-slate-400">{call.phone}</p>
                  </div>
                ) : (
                  <span className="text-slate-400">{call.phone ?? "Unknown"}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  call.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                  call.status === "NO_ANSWER" ? "bg-orange-100 text-orange-700" :
                  call.status === "DELIVERED" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {call.status.replace(/_/g, " ").toLowerCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">
                {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : "—"}
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">
                {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
