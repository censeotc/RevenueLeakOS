type IntegrationStatus = "CONNECTED" | "DISCONNECTED" | "ERROR" | "PENDING";

const statusConfig: Record<IntegrationStatus, { label: string; className: string; dot: string }> = {
  CONNECTED: { label: "Connected", className: "text-green-600", dot: "bg-green-500" },
  DISCONNECTED: { label: "Not connected", className: "text-slate-400", dot: "bg-slate-300" },
  ERROR: { label: "Error", className: "text-red-600", dot: "bg-red-500" },
  PENDING: { label: "Pending", className: "text-yellow-600", dot: "bg-yellow-500" },
};

export function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  const config = statusConfig[status] ?? statusConfig.DISCONNECTED;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}
