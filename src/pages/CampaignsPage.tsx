import { Megaphone, Play, Pause, Users, MessageSquare, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/contexts/ToastContext";
import { demoCampaigns, demoTemplates } from "@/data/seed";

const statusBadge: Record<string, { variant: "success" | "primary" | "warning" | "default"; label: string }> = {
  active: { variant: "success", label: "Active" },
  draft: { variant: "default", label: "Draft" },
  paused: { variant: "warning", label: "Paused" },
  completed: { variant: "primary", label: "Completed" },
};

export function CampaignsPage() {
  const { addToast } = useToast();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">Automated outreach sequences</p>
        </div>
        <Button
          size="sm"
          onClick={() => addToast({ type: "info", title: "Coming soon", description: "Campaign builder available in full release" })}
        >
          <Megaphone size={14} /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoCampaigns.map((camp) => {
          const sb = statusBadge[camp.status] ?? { variant: "default" as const, label: camp.status };
          const responseRate = camp.sentCount > 0 ? Math.round((camp.responseCount / camp.sentCount) * 100) : 0;
          const bookingRate = camp.responseCount > 0 ? Math.round((camp.bookedCount / camp.responseCount) * 100) : 0;

          return (
            <Card key={camp.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{camp.name}</h3>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{camp.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Targets</p>
                  <p className="text-lg font-semibold text-gray-900">{camp.targetCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sent</p>
                  <p className="text-lg font-semibold text-gray-900">{camp.sentCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Responses</p>
                  <p className="text-lg font-semibold text-primary-600">{camp.responseCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Booked</p>
                  <p className="text-lg font-semibold text-success-600">{camp.bookedCount}</p>
                </div>
              </div>

              {camp.sentCount > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Response Rate</span>
                    <span>{responseRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full transition-all"
                      style={{ width: `${responseRate}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MessageSquare size={12} />
                  {camp.steps.length} steps
                </div>
                <span className="text-gray-300">|</span>
                <div className="text-xs text-gray-500 capitalize">{camp.type.replace("_", " ")}</div>
                <div className="flex-1" />
                {camp.status === "active" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addToast({ type: "warning", title: "Campaign paused", description: camp.name })}
                  >
                    <Pause size={12} /> Pause
                  </Button>
                )}
                {camp.status === "draft" && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => addToast({ type: "success", title: "Campaign launched", description: camp.name })}
                  >
                    <Play size={12} /> Launch
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
