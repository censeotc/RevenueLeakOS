import { useState } from "react";
import { FileText, DollarSign, AlertTriangle, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CSVImport } from "@/components/ui/CSVImport";
import { useToast } from "@/contexts/ToastContext";
import { demoEstimates, getContactById } from "@/data/seed";
import { formatDistanceToNow } from "date-fns";

const statusConfig: Record<string, { variant: "success" | "danger" | "warning" | "primary" | "default" | "blue"; label: string }> = {
  sent: { variant: "primary", label: "Sent" },
  viewed: { variant: "blue", label: "Viewed" },
  stale: { variant: "warning", label: "Stale" },
  follow_up: { variant: "primary", label: "Follow-Up" },
  booked: { variant: "success", label: "Booked" },
  expired: { variant: "danger", label: "Expired" },
};

export function EstimatesPage() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [showImport, setShowImport] = useState(false);

  const filtered = demoEstimates.filter((e) => filter === "all" || e.status === filter);
  const staleTotal = demoEstimates.filter((e) => e.status === "stale").reduce((s, e) => s + e.amount, 0);
  const totalValue = demoEstimates.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Estimates</h1>
          <p className="text-sm text-gray-500 mt-0.5">{demoEstimates.length} estimates tracked</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setShowImport(!showImport)}>
          <Upload size={14} /> Import CSV
        </Button>
      </div>

      {showImport && (
        <CSVImport
          entityType="estimates"
          expectedColumns={["estimateNumber", "amount", "serviceType", "contactEmail", "status"]}
          onImport={(rows) => {
            setShowImport(false);
          }}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Total Pipeline</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalValue.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Stale Value</p>
          <p className="text-2xl font-bold text-warning-600 mt-1">${staleTotal.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Booked</p>
          <p className="text-2xl font-bold text-success-600 mt-1">
            {demoEstimates.filter((e) => e.status === "booked").length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Needs Attention</p>
          <p className="text-2xl font-bold text-danger-600 mt-1">
            {demoEstimates.filter((e) => e.status === "stale" || e.status === "expired").length}
          </p>
        </Card>
      </div>

      <div className="flex gap-2">
        {["all", "sent", "viewed", "stale", "follow_up", "booked", "expired"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f === "all" ? "All" : f.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      <Card padding={false}>
        {filtered.length === 0 ? (
          <EmptyState title="No estimates" description="No estimates match this filter." />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Estimate</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Sent</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((est) => {
                const contact = getContactById(est.contactId);
                const cfg = statusConfig[est.status] ?? { variant: "default" as const, label: est.status };
                return (
                  <tr key={est.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{est.estimateNumber}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-700">
                        {contact ? `${contact.firstName} ${contact.lastName}` : "Unknown"}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-600">{est.serviceType}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">${est.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs text-gray-500">{formatDistanceToNow(est.sentAt, { addSuffix: true })}</p>
                    </td>
                    <td className="px-5 py-3">
                      {(est.status === "stale" || est.status === "sent") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            addToast({
                              type: "success",
                              title: "Follow-up sent",
                              description: `Follow-up for ${est.estimateNumber} queued`,
                            })
                          }
                        >
                          Follow Up
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
