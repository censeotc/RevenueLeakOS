"use client";

const AVAILABLE_VARIABLES = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "businessName", label: "Business Name" },
  { key: "businessPhone", label: "Business Phone" },
  { key: "service", label: "Service Type" },
  { key: "estimateNumber", label: "Estimate Number" },
  { key: "estimateAmount", label: "Estimate Amount" },
  { key: "equipmentType", label: "Equipment Type" },
  { key: "discountPercent", label: "Discount %" },
];

interface VariablePickerProps {
  onInsert: (variable: string) => void;
}

export function VariablePicker({ onInsert }: VariablePickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Insert Variable</p>
      <div className="flex flex-wrap gap-1">
        {AVAILABLE_VARIABLES.map((v) => (
          <button
            key={v.key}
            onClick={() => onInsert(`{{${v.key}}}`)}
            className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
