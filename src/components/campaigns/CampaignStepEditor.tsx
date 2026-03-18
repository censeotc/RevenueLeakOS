"use client";

import { Trash2, MessageSquare, Mail, Clock } from "lucide-react";
import type { CampaignStep } from "@/types/revenue";

interface CampaignStepEditorProps {
  step: CampaignStep;
  stepNumber: number;
  onChange: (step: CampaignStep) => void;
  onRemove: () => void;
}

const stepTypeIcons = {
  SMS: MessageSquare,
  EMAIL: Mail,
  WAIT: Clock,
};

export function CampaignStepEditor({ step, stepNumber, onChange, onRemove }: CampaignStepEditorProps) {
  const Icon = stepTypeIcons[step.type as keyof typeof stepTypeIcons] ?? MessageSquare;

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
            {stepNumber}
          </div>
          <Icon className="h-4 w-4 text-slate-400" />
          <select
            value={step.type}
            onChange={(e) => onChange({ ...step, type: e.target.value as CampaignStep["type"] })}
            className="text-sm text-slate-700 border-0 focus:ring-0 bg-transparent font-medium"
          >
            <option value="SMS">SMS</option>
            <option value="EMAIL">Email</option>
            <option value="WAIT">Wait</option>
          </select>
        </div>
        <button onClick={onRemove} className="p-1 rounded hover:bg-slate-100 transition-colors">
          <Trash2 className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {step.type !== "WAIT" && (
        <>
          {step.type === "EMAIL" && (
            <input
              value={step.subject ?? ""}
              onChange={(e) => onChange({ ...step, subject: e.target.value })}
              placeholder="Subject line"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <textarea
            value={step.body}
            onChange={(e) => onChange({ ...step, body: e.target.value })}
            placeholder="Message body... Use {{firstName}}, {{businessName}}, etc."
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </>
      )}

      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span>Send after</span>
        <input
          type="number"
          value={step.delayDays}
          onChange={(e) => onChange({ ...step, delayDays: parseInt(e.target.value, 10) || 0 })}
          min={0}
          className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span>days</span>
        <input
          type="number"
          value={step.delayHours}
          onChange={(e) => onChange({ ...step, delayHours: parseInt(e.target.value, 10) || 0 })}
          min={0}
          max={23}
          className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span>hours</span>
      </div>
    </div>
  );
}
