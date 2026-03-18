"use client";

import { useState } from "react";
import { VariablePicker } from "./VariablePicker";
import { TemplatePreview } from "./TemplatePreview";
import type { TemplateRecord } from "@/types/revenue";

interface TemplateEditorProps {
  template?: Partial<TemplateRecord>;
  onSave?: (template: Partial<TemplateRecord>) => void;
}

export function TemplateEditor({ template, onSave }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [type, setType] = useState<"SMS" | "EMAIL">(template?.type ?? "SMS");
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [body, setBody] = useState(template?.body ?? "");
  const [preview, setPreview] = useState(false);

  function insertVariable(variable: string) {
    setBody((prev) => prev + variable);
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Template name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Estimate Follow-Up #1"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "SMS" | "EMAIL")}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SMS">SMS</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>
      </div>

      {type === "EMAIL" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject line</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Following up on your estimate, {{firstName}}"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Message body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message... use variables below to personalize"
          rows={5}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <VariablePicker onInsert={insertVariable} />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPreview((v) => !v)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {preview ? "Hide preview" : "Show preview"}
        </button>
      </div>

      {preview && <TemplatePreview body={body} type={type} subject={subject} />}

      <div className="flex justify-end gap-2">
        <button className="border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button
          onClick={() => onSave?.({ name, type, subject, body })}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Template
        </button>
      </div>
    </div>
  );
}
