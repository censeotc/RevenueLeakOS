"use client";

import { useState } from "react";
import { TemplateEditor } from "./TemplateEditor";
import { demoTemplates } from "@/data/demoData";
import type { TemplateRecord } from "@/types/revenue";

export function TemplateTable() {
  const [editing, setEditing] = useState<TemplateRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Preview</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {demoTemplates.map((template) => (
              <tr key={template.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{template.name}</p>
                    {template.isSystem && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">System</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${template.type === "SMS" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {template.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">
                  {template.body}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setEditing(template)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 mt-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Edit Template</h2>
            <TemplateEditor template={editing} onSave={() => setEditing(null)} />
          </div>
        </div>
      )}
    </>
  );
}
