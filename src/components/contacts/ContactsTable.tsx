"use client";

import { useState } from "react";
import { ContactDetailPanel } from "./ContactDetailPanel";
import { ContactTags } from "./ContactTags";
import { demoContacts } from "@/data/demoData";
import type { ContactRecord } from "@/types/revenue";

export function ContactsTable() {
  const [selected, setSelected] = useState<ContactRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">SMS Opt-in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {demoContacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelected(contact)}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">
                    {contact.firstName} {contact.lastName}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-600">{contact.phone ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{contact.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <ContactTags tags={contact.tags ?? []} />
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${contact.optedInSms ? "bg-green-500" : "bg-slate-300"}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <ContactDetailPanel contact={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
