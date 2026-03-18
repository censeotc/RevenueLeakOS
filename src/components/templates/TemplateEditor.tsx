"use client";

import { useState } from "react";

interface TemplateEditorProps {
  initialName?: string;
  initialChannel?: string;
  initialSubject?: string;
  initialBody?: string;
  onSave?: (data: { name: string; channel: string; subject: string; body: string }) => void;
  onCancel?: () => void;
}

export function TemplateEditor({
  initialName = "",
  initialChannel = "sms",
  initialSubject = "",
  initialBody = "",
  onSave,
  onCancel,
}: TemplateEditorProps) {
  const [name, setName] = useState(initialName);
  const [channel, setChannel] = useState(initialChannel);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Template Editor</h3>
      <div className="space-y-2">
        <label htmlFor="tpl-name" className="text-sm font-medium">Name</label>
        <input
          id="tpl-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="tpl-channel" className="text-sm font-medium">Channel</label>
        <select
          id="tpl-channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
      </div>
      {channel === "email" && (
        <div className="space-y-2">
          <label htmlFor="tpl-subject" className="text-sm font-medium">Subject</label>
          <input
            id="tpl-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="tpl-body" className="text-sm font-medium">Body</label>
        <textarea
          id="tpl-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave?.({ name, channel, subject, body })}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Save Template
        </button>
        <button
          onClick={onCancel}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
