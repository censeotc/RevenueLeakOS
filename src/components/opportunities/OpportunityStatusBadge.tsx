import type { OpportunityStatus } from "@/types/revenue";

const statusConfig: Record<OpportunityStatus, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "In Progress", className: "bg-yellow-100 text-yellow-700" },
  WON: { label: "Won", className: "bg-green-100 text-green-700" },
  LOST: { label: "Lost", className: "bg-red-100 text-red-700" },
  DISMISSED: { label: "Dismissed", className: "bg-slate-100 text-slate-500" },
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  const config = statusConfig[status] ?? statusConfig.OPEN;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
