import { useState } from "react";
import { Target, User, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SelectInput } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { opportunityService } from "@/services/opportunityService";
import { getContactById, getUserById, demoUsers } from "@/data/seed";
import { formatDistanceToNow } from "date-fns";
import type { OpportunityStatus } from "@/types";

const typeConfig: Record<string, { label: string; color: string }> = {
  missed_call: { label: "Missed Call", color: "danger" },
  estimate_rescue: { label: "Estimate Rescue", color: "warning" },
  reactivation: { label: "Reactivation", color: "primary" },
};

const statusFlow: OpportunityStatus[] = ["new", "contacted", "in_progress", "responded", "booked", "won", "lost"];

export function OpportunitiesPage() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [opps, setOpps] = useState(opportunityService.getAll());
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const summary = opportunityService.getSummary();

  function refresh() {
    setOpps(opportunityService.getAll());
  }

  function handleStatusChange(id: string, status: OpportunityStatus) {
    opportunityService.updateStatus(id, status);
    refresh();
    addToast({ type: "success", title: "Status updated", description: `Opportunity moved to ${status}` });
  }

  function handleAssign(id: string, userId: string) {
    opportunityService.assign(id, userId);
    refresh();
    const u = getUserById(userId);
    addToast({ type: "info", title: "Assigned", description: `Assigned to ${u?.name}` });
  }

  const filtered = opps.filter((o) => {
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {summary.open} open &middot; ${summary.totalPipeline.toLocaleString()} pipeline
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Total Pipeline</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${summary.totalPipeline.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Recovered</p>
          <p className="text-2xl font-bold text-success-600 mt-1">${summary.totalRecovered.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Won</p>
          <p className="text-2xl font-bold text-success-600 mt-1">{summary.won}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Lost</p>
          <p className="text-2xl font-bold text-danger-600 mt-1">{summary.lost}</p>
        </Card>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {["all", "missed_call", "estimate_rescue", "reactivation"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${typeFilter === t ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {t === "all" ? "All Types" : typeConfig[t]?.label ?? t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["all", "new", "contacted", "in_progress", "responded", "booked", "won", "lost"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {s === "all" ? "All" : s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <Card padding={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Target size={24} className="text-gray-400" />}
            title="No opportunities"
            description="No opportunities match the current filters."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((opp) => {
              const contact = getContactById(opp.contactId);
              const assigned = opp.assignedToId ? getUserById(opp.assignedToId) : null;
              const tc = typeConfig[opp.type];
              const currentIdx = statusFlow.indexOf(opp.status);
              const nextStatus = currentIdx < statusFlow.length - 2 ? statusFlow[currentIdx + 1] : null;

              return (
                <div key={opp.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{opp.title}</h3>
                        <Badge variant={tc?.color as any ?? "default"}>{tc?.label ?? opp.type}</Badge>
                        <Badge
                          variant={
                            opp.status === "won" || opp.status === "booked"
                              ? "success"
                              : opp.status === "lost"
                              ? "danger"
                              : opp.status === "new"
                              ? "warning"
                              : "primary"
                          }
                        >
                          {opp.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {opp.description && (
                        <p className="text-xs text-gray-500 mb-2">{opp.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {contact && <span>{contact.firstName} {contact.lastName}</span>}
                        <span>${opp.estimatedValue.toLocaleString()}</span>
                        <span>{formatDistanceToNow(opp.createdAt, { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={opp.assignedToId ?? ""}
                        onChange={(e) => e.target.value && handleAssign(opp.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                      >
                        <option value="">Unassigned</option>
                        {demoUsers.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                      {nextStatus && !["won", "lost"].includes(opp.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(opp.id, nextStatus)}
                        >
                          <ArrowRight size={12} />
                          {nextStatus.replace("_", " ")}
                        </Button>
                      )}
                      {!["won", "lost"].includes(opp.status) && (
                        <>
                          <Button variant="success" size="sm" onClick={() => handleStatusChange(opp.id, "won")}>
                            Won
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(opp.id, "lost")}>
                            Lost
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
