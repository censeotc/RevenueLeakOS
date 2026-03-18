"use client";

import { X, Phone, Clock, User } from "lucide-react";
import type { CallRecord } from "@/types/revenue";

interface CallDetailPanelProps {
  call: CallRecord;
  onClose: () => void;
}

export function CallDetailPanel({ call, onClose }: CallDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-100 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Call Details</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">Contact</span>
            </div>
            <p className="text-sm font-medium text-slate-900">{call.contactName ?? "Unknown"}</p>
            <p className="text-xs text-slate-400">{call.phone}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">Duration</span>
            </div>
            <p className="text-sm font-medium text-slate-900">
              {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : "N/A"}
            </p>
          </div>
        </div>

        {call.body && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Message</h4>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">{call.body}</div>
          </div>
        )}

        {call.transcript && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Transcript</h4>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap">
              {call.transcript}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Call Back
          </button>
          <button className="flex-1 border border-slate-200 text-slate-700 text-sm py-2 rounded-lg hover:bg-slate-50 transition-colors">
            View Contact
          </button>
        </div>
      </div>
    </div>
  );
}
