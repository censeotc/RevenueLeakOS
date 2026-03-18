"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type IntegrationRow = {
  id: string;
  provider: string;
  status: string;
  lastSyncAt: string | null;
};

export function IntegrationsModule({ rows }: { rows: IntegrationRow[] }) {
  const [message, setMessage] = useState<string | null>(null);

  async function execute(provider: string, action: "connect" | "disconnect" | "test") {
    const response = await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, action }),
    });
    setMessage(response.ok ? `${provider} ${action} action completed.` : `Failed to ${action} ${provider}.`);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {rows.map((integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <CardTitle className="capitalize">{integration.provider.replace("_", " ")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-500">Status</span>
              <Badge>{integration.status}</Badge>
            </div>
            <div className="text-xs text-slate-500">
              Last sync:{" "}
              {integration.lastSyncAt
                ? new Date(integration.lastSyncAt).toLocaleString("en-US")
                : "Never"}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => execute(integration.provider, "connect")}>
                Connect
              </Button>
              <Button size="sm" variant="outline" onClick={() => execute(integration.provider, "disconnect")}>
                Disconnect
              </Button>
              <Button size="sm" variant="ghost" onClick={() => execute(integration.provider, "test")}>
                Test
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {message ? <p className="md:col-span-2 xl:col-span-4 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
