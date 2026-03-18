"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CampaignStepEditor } from "./CampaignStepEditor";
import type { Campaign, CampaignStep } from "@/types/revenue";

interface CampaignEditorProps {
  campaign?: Partial<Campaign>;
  onSave?: (campaign: Partial<Campaign>) => void;
}

export function CampaignEditor({ campaign, onSave }: CampaignEditorProps) {
  const [name, setName] = useState(campaign?.name ?? "");
  const [steps, setSteps] = useState<CampaignStep[]>(campaign?.steps ?? []);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        order: prev.length + 1,
        type: "SMS",
        delayDays: 1,
        delayHours: 0,
        body: "",
      },
    ]);
  }

  function updateStep(index: number, step: CampaignStep) {
    setSteps((prev) => prev.map((s, i) => (i === index ? step : s)));
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Campaign name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Estimate Follow-Up Sequence"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Steps</h3>
          <button
            onClick={addStep}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add step
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <CampaignStepEditor
              key={step.id}
              step={step}
              stepNumber={index + 1}
              onChange={(s) => updateStep(index, s)}
              onRemove={() => removeStep(index)}
            />
          ))}
          {steps.length === 0 && (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <p className="text-sm text-slate-400">No steps yet. Add your first step above.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
          Save as Draft
        </button>
        <button
          onClick={() => onSave?.({ name, steps })}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save & Activate
        </button>
      </div>
    </div>
  );
}
