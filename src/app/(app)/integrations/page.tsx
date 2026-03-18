"use client";

import { useState } from "react";
import { usePilotData } from "@/components/providers/pilot-data-provider";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import {
  Phone,
  Calendar,
  Briefcase,
  Home,
  Wrench,
  Mail,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const providerIcons: Record<string, React.ReactNode> = {
  twilio: <Phone className="h-6 w-6" />,
  google_calendar: <Calendar className="h-6 w-6" />,
  jobber: <Briefcase className="h-6 w-6" />,
  housecall_pro: <Home className="h-6 w-6" />,
  service_titan: <Wrench className="h-6 w-6" />,
  gmail: <Mail className="h-6 w-6" />,
  outlook: <Mail className="h-6 w-6" />,
  csv_import: <Upload className="h-6 w-6" />,
};

const statusIcons: Record<string, React.ReactNode> = {
  connected: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  disconnected: <XCircle className="h-5 w-5 text-gray-400" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  pending: <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />,
};

export default function IntegrationsPage() {
  const { integrations } = usePilotData();
  const [testing, setTesting] = useState<string | null>(null);

  const handleTest = (provider: string) => {
    setTesting(provider);
    setTimeout(() => setTesting(null), 2000);
  };

  return (
    <div>
      <TopBar title="Integrations" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Connected Services</h2>
          <p className="text-sm text-muted-foreground">Manage your integrations and data connections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.provider} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-3 ${
                      integration.status === "connected" ? "bg-green-50 text-green-600" :
                      integration.status === "pending" ? "bg-amber-50 text-amber-600" :
                      integration.status === "error" ? "bg-red-50 text-red-600" :
                      "bg-gray-50 text-gray-400"
                    }`}>
                      {providerIcons[integration.provider]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  {statusIcons[integration.status]}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={integration.status} />
                    {integration.lastSyncAt && (
                      <span className="text-xs text-muted-foreground">
                        Last sync: {timeAgo(integration.lastSyncAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleTest(integration.provider)}
                          disabled={testing === integration.provider}
                        >
                          {testing === integration.provider ? (
                            <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Testing...</>
                          ) : (
                            "Test"
                          )}
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1">
                          Disconnect
                        </Button>
                      </>
                    ) : integration.status === "pending" ? (
                      <Button variant="outline" size="sm" className="flex-1">
                        Complete Setup
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
