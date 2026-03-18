import type { CampaignStatus } from "@/types/revenue";

const statusConfig: Record<CampaignStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-700" },
  PAUSED: { label: "Paused", className: "bg-yellow-100 text-yellow-700" },
  COMPLETED: { label: "Completed", className: "bg-blue-100 text-blue-700" },
  ARCHIVED: { label: "Archived", className: "bg-slate-100 text-slate-400" },
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const config = statusConfig[status] ?? statusConfig.DRAFT;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
