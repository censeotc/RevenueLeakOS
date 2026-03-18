"use client";

import { useState } from "react";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";
import type { IntegrationItem } from "@/types/revenue";

interface IntegrationCardProps {
  integration: IntegrationItem;
}

export function IntegrationCard({ integration }: IntegrationCardProps) {
  const [status, setStatus] = useState(integration.status);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("CONNECTED");
    setLoading(false);
  }

  async function handleDisconnect() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setStatus("DISCONNECTED");
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
          {integration.logoText}
        </div>
        <IntegrationStatusBadge status={status} />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">{integration.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{integration.description}</p>
      </div>

      {status === "CONNECTED" ? (
        <button
          onClick={handleDisconnect}
          disabled={loading}
          className="w-full text-sm text-slate-600 border border-slate-200 py-1.5 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {loading ? "Disconnecting..." : "Disconnect"}
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full text-sm bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect"}
        </button>
      )}
    </div>
  );
}
