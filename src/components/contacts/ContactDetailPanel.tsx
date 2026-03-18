"use client";

import { X, Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { ContactTags } from "./ContactTags";
import type { ContactRecord } from "@/types/revenue";

interface ContactDetailPanelProps {
  contact: ContactRecord;
  onClose: () => void;
}

export function ContactDetailPanel({ contact, onClose }: ContactDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-100 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Contact Details</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold">
            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{contact.firstName} {contact.lastName}</h3>
            <ContactTags tags={contact.tags ?? []} />
          </div>
        </div>

        <div className="space-y-2">
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {contact.phone}
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {contact.email}
            </div>
          )}
          {contact.city && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {contact.city}, {contact.state}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-slate-900">{contact.opportunityCount ?? 0}</p>
            <p className="text-xs text-slate-400">Opportunities</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-slate-900">{contact.estimateCount ?? 0}</p>
            <p className="text-xs text-slate-400">Estimates</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
            Send SMS
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 text-sm py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Phone className="h-3.5 w-3.5" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}
