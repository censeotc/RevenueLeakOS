import {
  Phone, Calendar, Briefcase, Home, Wrench, Mail, Upload,
  CheckCircle, XCircle, Clock, ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { demoIntegrations } from "@/data/seed";
import { formatDistanceToNow } from "date-fns";

const iconMap: Record<string, React.ReactNode> = {
  phone: <Phone size={20} />,
  calendar: <Calendar size={20} />,
  briefcase: <Briefcase size={20} />,
  home: <Home size={20} />,
  wrench: <Wrench size={20} />,
  mail: <Mail size={20} />,
  upload: <Upload size={20} />,
};

const statusConfig: Record<string, { variant: "success" | "danger" | "warning"; icon: React.ReactNode }> = {
  connected: { variant: "success", icon: <CheckCircle size={14} /> },
  disconnected: { variant: "danger", icon: <XCircle size={14} /> },
  pending: { variant: "warning", icon: <Clock size={14} /> },
};

export function IntegrationsPage() {
  const { addToast } = useToast();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-500 mt-0.5">Connect your tools and services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoIntegrations.map((integration) => {
          const sc = statusConfig[integration.status];
          return (
            <Card key={integration.provider}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  {iconMap[integration.icon] ?? <ExternalLink size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{integration.name}</h3>
                    <Badge variant={sc.variant}>
                      <span className="flex items-center gap-1">
                        {sc.icon}
                        {integration.status}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{integration.description}</p>
                  {integration.lastSyncAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last sync: {formatDistanceToNow(integration.lastSyncAt, { addSuffix: true })}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {integration.status === "connected" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addToast({ type: "info", title: "Syncing...", description: `Re-syncing ${integration.name}` })}
                    >
                      Sync
                    </Button>
                  ) : integration.status === "disconnected" ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => addToast({ type: "success", title: "Connected", description: `${integration.name} connected (demo)` })}
                    >
                      Connect
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      Pending
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
