"use client";

import type { OpportunityStatus, OpportunityType } from "@/types/revenue";

interface OpportunityFiltersProps {
  status: OpportunityStatus | "ALL";
  type: OpportunityType | "ALL";
  onStatusChange: (status: OpportunityStatus | "ALL") => void;
  onTypeChange: (type: OpportunityType | "ALL") => void;
}

export function OpportunityFilters({ status, type, onStatusChange, onTypeChange }: OpportunityFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as OpportunityStatus | "ALL")}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="ALL">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="WON">Won</option>
        <option value="LOST">Lost</option>
        <option value="DISMISSED">Dismissed</option>
      </select>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value as OpportunityType | "ALL")}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="ALL">All types</option>
        <option value="UNSOLD_ESTIMATE">Unsold Estimate</option>
        <option value="MISSED_CALL">Missed Call</option>
        <option value="LAPSED_CUSTOMER">Lapsed Customer</option>
        <option value="MANUAL">Manual</option>
      </select>
    </div>
  );
}
