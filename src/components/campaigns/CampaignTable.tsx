"use client";

import { formatDistanceToNow } from "date-fns";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { demoCampaigns } from "@/data/demoData";

export function CampaignTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Enrolled</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Converted</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Launched</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {demoCampaigns.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{campaign.name}</p>
                {campaign.description && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{campaign.description}</p>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600 capitalize">
                {campaign.type.replace(/_/g, " ").toLowerCase()}
              </td>
              <td className="px-4 py-3">
                <CampaignStatusBadge status={campaign.status} />
              </td>
              <td className="px-4 py-3 text-center font-medium text-slate-900">
                {campaign.enrolledCount ?? 0}
              </td>
              <td className="px-4 py-3 text-center font-medium text-green-600">
                {campaign.convertedCount ?? 0}
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">
                {campaign.launchedAt
                  ? formatDistanceToNow(new Date(campaign.launchedAt), { addSuffix: true })
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
