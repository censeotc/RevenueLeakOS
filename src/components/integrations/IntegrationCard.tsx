import type { IntegrationRow } from "@/types/revenue";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IntegrationCardProps {
  integration: IntegrationRow;
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
}

export function IntegrationCard({ integration, onConnect, onDisconnect }: IntegrationCardProps) {
  const isConnected = integration.status === "CONNECTED";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base capitalize">{integration.provider}</CardTitle>
        <IntegrationStatusBadge status={integration.status} />
      </CardHeader>
      <CardContent>
        <button
          onClick={() =>
            isConnected
              ? onDisconnect?.(integration.id)
              : onConnect?.(integration.id)
          }
          className={`mt-2 rounded-md px-4 py-2 text-sm font-medium ${
            isConnected
              ? "border hover:bg-muted"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </CardContent>
    </Card>
  );
}
