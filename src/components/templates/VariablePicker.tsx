"use client";

import { availableTemplateVariables } from "@/lib/constants";

interface VariablePickerProps {
  onInsert: (variable: string) => void;
}

export function VariablePicker({ onInsert }: VariablePickerProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Insert Variable</p>
      <div className="flex flex-wrap gap-1.5">
        {availableTemplateVariables.map((variable) => (
          <button
            key={variable.key}
            onClick={() => onInsert(`{{${variable.key}}}`)}
            title={variable.description}
            className="text-xs bg-white border border-slate-200 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {`{{${variable.key}}}`}
          </button>
        ))}
      </div>
    </div>
  );
}
