"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Clock, RefreshCw, Link2, Unlink, TestTube2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTimeAgo, cn } from "@/lib/utils";
import { subHours, subDays } from "date-fns";

const INTEGRATIONS = [
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS and voice communications for all outbound messages and missed call detection",
    logoText: "T",
    logoColor: "bg-red-500",
    status: "connected",
    lastSync: subHours(new Date(), 1),
    features: ["SMS Outbound", "SMS Inbound", "Missed Call Webhook", "Call Recording"],
  },
  {
    id: "jobber",
    name: "Jobber",
    description: "Field service management — sync estimates, jobs, and customer records",
    logoText: "J",
    logoColor: "bg-orange-500",
    status: "connected",
    lastSync: subHours(new Date(), 2),
    features: ["Estimate Sync", "Job Sync", "Customer Sync", "Booking Push"],
  },
  {
    id: "housecall_pro",
    name: "Housecall Pro",
    description: "Sync estimates and customer data from Housecall Pro",
    logoText: "H",
    logoColor: "bg-blue-600",
    status: "disconnected",
    lastSync: null,
    features: ["Estimate Sync", "Customer Sync", "Job Status"],
  },
  {
    id: "servicetitan",
    name: "ServiceTitan",
    description: "Enterprise field service platform integration for estimate and customer sync",
    logoText: "ST",
    logoColor: "bg-indigo-600",
    status: "disconnected",
    lastSync: null,
    features: ["Estimate Sync", "Customer Sync", "Booking Sync", "Revenue Attribution"],
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send and receive email follow-ups directly from your Google Workspace",
    logoText: "G",
    logoColor: "bg-red-400",
    status: "pending",
    lastSync: null,
    features: ["Email Outbound", "Email Inbound", "Thread Tracking"],
  },
  {
    id: "outlook",
    name: "Outlook",
    description: "Microsoft 365 email integration for estimate and customer communications",
    logoText: "O",
    logoColor: "bg-blue-500",
    status: "disconnected",
    lastSync: null,
    features: ["Email Outbound", "Email Inbound", "Calendar Sync"],
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Sync bookings and appointments with Google Calendar",
    logoText: "GC",
    logoColor: "bg-green-500",
    status: "disconnected",
    lastSync: null,
    features: ["Booking Sync", "Appointment Reminders", "Availability Check"],
  },
  {
    id: "csv",
    name: "CSV Import",
    description: "Import contacts and estimates from CSV files exported from any platform",
    logoText: "CSV",
    logoColor: "bg-slate-600",
    status: "connected",
    lastSync: subDays(new Date(), 7),
    features: ["Contact Import", "Estimate Import", "Field Mapping", "Duplicate Detection"],
  },
];

const STATUS_CONFIG = {
  connected: { label: "Connected", color: "bg-green-100 text-green-700", icon: CheckCircle },
  disconnected: { label: "Disconnected", color: "bg-gray-100 text-gray-600", icon: XCircle },
  error: { label: "Error", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
};

export default function IntegrationsPage() {
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, "success" | "error">>({});

  async function testConnection(id: string) {
    setTesting(id);
    await new Promise((r) => setTimeout(r, 1500));
    setTestResults((prev) => ({ ...prev, [id]: "success" }));
    setTesting(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
        <p className="text-slate-500 text-sm mt-1">Connect your tools to automate data sync</p>
      </div>

      {/* Connected summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <Link2 className="h-5 w-5 text-blue-500 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            {INTEGRATIONS.filter((i) => i.status === "connected").length} integrations connected
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Twilio and Jobber are active and syncing. Connect more tools to improve automation.
          </p>
        </div>
      </div>

      {/* Integration cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((integration) => {
          const statusCfg = STATUS_CONFIG[integration.status as keyof typeof STATUS_CONFIG];
          const StatusIcon = statusCfg.icon;
          const isConnected = integration.status === "connected";
          const testResult = testResults[integration.id];

          return (
            <Card key={integration.id} className={cn(isConnected ? "" : "opacity-80")}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0", integration.logoColor)}>
                    {integration.logoText}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0", statusCfg.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{integration.description}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {integration.features.map((f) => (
                        <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>

                    {integration.lastSync && (
                      <p className="text-xs text-slate-400 mt-2">
                        Last sync: {formatTimeAgo(integration.lastSync)}
                      </p>
                    )}

                    {testResult === "success" && (
                      <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Connection test passed
                      </p>
                    )}

                    <div className="flex gap-2 mt-3">
                      {isConnected ? (
                        <>
                          <Button size="sm" variant="outline" loading={testing === integration.id} onClick={() => testConnection(integration.id)}>
                            <TestTube2 className="h-3 w-3" /> Test
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-3 w-3" /> Sync
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 ml-auto">
                            <Unlink className="h-3 w-3" /> Disconnect
                          </Button>
                        </>
                      ) : integration.id === "csv" ? (
                        <Button size="sm">
                          <Upload className="h-3 w-3" /> Import File
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Link2 className="h-3 w-3" /> Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
