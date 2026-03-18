"use client";

import { X, DollarSign, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { OpportunityStatusBadge } from "./OpportunityStatusBadge";
import { OpportunityNotes } from "./OpportunityNotes";
import type { Opportunity } from "@/types/revenue";

interface OpportunityDetailPanelProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export function OpportunityDetailPanel({ opportunity, onClose }: OpportunityDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-100 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Opportunity Details</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <OpportunityStatusBadge status={opportunity.status} />
            <span className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-slate-700">{opportunity.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">Value</span>
            </div>
            <p className="text-lg font-bold text-slate-900">${opportunity.value.toLocaleString()}</p>
          </div>
          {opportunity.contact && (
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Contact</span>
              </div>
              <p className="text-sm font-medium text-slate-900">
                {opportunity.contact.firstName} {opportunity.contact.lastName}
              </p>
              <p className="text-xs text-slate-400">{opportunity.contact.phone}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Send Follow-up
          </button>
          <button className="flex-1 border border-slate-200 text-slate-700 text-sm py-2 rounded-lg hover:bg-slate-50 transition-colors">
            Mark Won
          </button>
        </div>

        <OpportunityNotes opportunityId={opportunity.id} notes={opportunity.notes ?? []} />
      </div>
    </div>
  );
}
