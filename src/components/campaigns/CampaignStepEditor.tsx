"use client";

import { useState } from "react";

interface CampaignStepEditorProps {
  order: number;
  onSave?: (step: { channel: string; delayDays: number; templateId?: string }) => void;
  onRemove?: () => void;
}

export function CampaignStepEditor({ order, onSave, onRemove }: CampaignStepEditorProps) {
  const [channel, setChannel] = useState("sms");
  const [delayDays, setDelayDays] = useState(0);

  return (
    <div className="flex items-center gap-4 rounded-md border p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
        {order}
      </span>
      <select
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="sms">SMS</option>
        <option value="email">Email</option>
      </select>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Delay</label>
        <input
          type="number"
          min={0}
          value={delayDays}
          onChange={(e) => setDelayDays(parseInt(e.target.value) || 0)}
          className="w-20 rounded-md border bg-background px-2 py-2 text-sm"
        />
        <span className="text-sm text-muted-foreground">days</span>
      </div>
      <button
        onClick={() => onSave?.({ channel, delayDays })}
        className="ml-auto rounded-md border px-3 py-1 text-sm hover:bg-muted"
      >
        Save
      </button>
      <button
        onClick={onRemove}
        className="text-sm text-destructive hover:underline"
      >
        Remove
      </button>
    </div>
  );
}
