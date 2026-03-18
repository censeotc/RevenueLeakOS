"use client";

import { useState } from "react";
import type { CampaignType } from "@/types/revenue";

interface CampaignEditorProps {
  onSave?: (data: { name: string; type: CampaignType }) => void;
  onCancel?: () => void;
}

export function CampaignEditor({ onSave, onCancel }: CampaignEditorProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("ESTIMATE_FOLLOWUP");

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">New Campaign</h3>
      <div className="space-y-2">
        <label htmlFor="campaign-name" className="text-sm font-medium">Campaign name</label>
        <input
          id="campaign-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="campaign-type" className="text-sm font-medium">Type</label>
        <select
          id="campaign-type"
          value={type}
          onChange={(e) => setType(e.target.value as CampaignType)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="ESTIMATE_FOLLOWUP">Estimate Follow-Up</option>
          <option value="REACTIVATION">Reactivation</option>
          <option value="MISSED_CALL">Missed Call</option>
          <option value="CUSTOM">Custom</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave?.({ name, type })}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Save Campaign
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
