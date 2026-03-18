"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Phone,
  Briefcase,
  Home,
  Building2,
  Mail,
  Calendar,
  FileSpreadsheet,
  Plug,
  Unplug,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DEMO_INTEGRATIONS } from "@/lib/demo-data";
import type { IntegrationCard } from "@/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquare: Phone,
  Phone: Phone,
  Briefcase: Briefcase,
  Home: Home,
  Building2: Building2,
  Mail: Mail,
  Calendar: Calendar,
  FileSpreadsheet: FileSpreadsheet,
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "success" | "secondary" | "destructive" | "warning" }
> = {
  connected: { label: "Connected", variant: "success" },
  disconnected: { label: "Disconnected", variant: "secondary" },
  error: { label: "Error", variant: "destructive" },
  pending: { label: "Pending Setup", variant: "warning" },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationCard[]>([
    ...DEMO_INTEGRATIONS,
  ]);
  const [connectDialog, setConnectDialog] = useState<IntegrationCard | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  function handleConnect(provider: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.provider === provider
          ? { ...i, status: "connected", lastSyncAt: new Date() }
          : i
      )
    );
    setConnectDialog(null);
  }

  function handleDisconnect(provider: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.provider === provider
          ? { ...i, status: "disconnected", lastSyncAt: undefined }
          : i
      )
    );
  }

  function handleTestConnection(provider: string) {
    setTestingId(provider);
    setTestResult(null);
    setTimeout(() => {
      setTestingId(null);
      setTestResult(provider);
      setTimeout(() => setTestResult(null), 3000);
    }, 1500);
  }

  function handleSync(provider: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.provider === provider ? { ...i, lastSyncAt: new Date() } : i
      )
    );
  }

  function handleReconnect(provider: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.provider === provider
          ? { ...i, status: "connected", lastSyncAt: new Date() }
          : i
      )
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect your tools and data sources"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const IconComponent = ICON_MAP[integration.icon] ?? Plug;
          const statusConfig = STATUS_CONFIG[integration.status] ?? STATUS_CONFIG.disconnected;
          const isTesting = testingId === integration.provider;
          const showSuccess = testResult === integration.provider;

          return (
            <Card key={integration.provider} className="relative">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                    <IconComponent className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {integration.lastSyncAt
                      ? `Synced ${formatDistanceToNow(integration.lastSyncAt, { addSuffix: true })}`
                      : "Never synced"}
                  </span>
                </div>

                {showSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Connection successful
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1 border-t">
                  {integration.status === "connected" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleDisconnect(integration.provider)}
                      >
                        <Unplug className="mr-1.5 h-3.5 w-3.5" />
                        Disconnect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isTesting}
                        onClick={() => handleTestConnection(integration.provider)}
                      >
                        {isTesting ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        {isTesting ? "Testing..." : "Test"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.provider)}
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Sync Now
                      </Button>
                    </>
                  )}

                  {integration.status === "disconnected" && (
                    <Button
                      size="sm"
                      onClick={() => setConnectDialog(integration)}
                    >
                      <Plug className="mr-1.5 h-3.5 w-3.5" />
                      Connect
                    </Button>
                  )}

                  {integration.status === "error" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                        onClick={() => handleReconnect(integration.provider)}
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Reconnect
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                        View Error
                      </Button>
                    </>
                  )}

                  {integration.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => setConnectDialog(integration)}
                    >
                      Complete Setup
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={connectDialog !== null}
        onOpenChange={(open) => {
          if (!open) setConnectDialog(null);
        }}
      >
        <DialogContent>
          {connectDialog && (
            <>
              <DialogHeader>
                <DialogTitle>Connect {connectDialog.name}</DialogTitle>
                <DialogDescription>
                  Enter your {connectDialog.name} credentials to establish the
                  connection.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    placeholder={`Enter your ${connectDialog.name} API key`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    placeholder="Enter API secret"
                  />
                </div>
                {connectDialog.provider === "twilio" && (
                  <div className="space-y-2">
                    <Label htmlFor="account-sid">Account SID</Label>
                    <Input
                      id="account-sid"
                      placeholder="Enter Twilio Account SID"
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConnectDialog(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleConnect(connectDialog.provider)}
                >
                  Connect
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
