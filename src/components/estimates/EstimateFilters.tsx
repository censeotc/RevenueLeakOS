"use client";

import type { EstimateStatus } from "@/types/revenue";

interface EstimateFiltersProps {
  status: EstimateStatus | "ALL";
  onStatusChange: (status: EstimateStatus | "ALL") => void;
}

export function EstimateFilters({ status, onStatusChange }: EstimateFiltersProps) {
  return (
    <div className="flex gap-4">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as EstimateStatus | "ALL")}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="ALL">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="DECLINED">Declined</option>
        <option value="EXPIRED">Expired</option>
        <option value="FOLLOW_UP">Follow Up</option>
      </select>
    </div>
  );
}
