"use client";

import { X, DollarSign, Calendar, User, Eye } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { EnrollFollowupButton } from "./EnrollFollowupButton";
import type { EstimateRecord } from "@/types/revenue";

interface EstimateDetailPanelProps {
  estimate: EstimateRecord;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  VIEWED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-slate-100 text-slate-500",
};

export function EstimateDetailPanel({ estimate, onClose }: EstimateDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-100 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Estimate Details</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[estimate.status] ?? "bg-slate-100 text-slate-500"}`}>
            {estimate.status.toLowerCase()}
          </span>
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(estimate.createdAt), { addSuffix: true })}
          </span>
        </div>

        {estimate.title && (
          <h3 className="font-semibold text-slate-900">{estimate.title}</h3>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">Amount</span>
            </div>
            <p className="text-lg font-bold text-slate-900">${estimate.amount.toLocaleString()}</p>
          </div>
          {estimate.contact && (
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Contact</span>
              </div>
              <p className="text-sm font-medium text-slate-900">
                {estimate.contact.firstName} {estimate.contact.lastName}
              </p>
            </div>
          )}
        </div>

        {estimate.viewedAt && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Eye className="h-4 w-4" />
            Viewed {formatDistanceToNow(new Date(estimate.viewedAt), { addSuffix: true })}
          </div>
        )}

        {(estimate.status === "PENDING" || estimate.status === "VIEWED") && (
          <EnrollFollowupButton estimateId={estimate.id} />
        )}
      </div>
    </div>
  );
}
