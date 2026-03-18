import { useState } from "react";
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneOff,
  Clock, Play,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/contexts/ToastContext";
import { twilioMockService } from "@/services/twilioMockService";
import { demoContacts, getContactById } from "@/data/seed";
import { formatDistanceToNow, format } from "date-fns";

const statusBadge: Record<string, { variant: "success" | "danger" | "warning" | "primary" | "default"; label: string }> = {
  missed: { variant: "danger", label: "Missed" },
  after_hours: { variant: "warning", label: "After Hours" },
  responded: { variant: "success", label: "Responded" },
  booked: { variant: "success", label: "Booked" },
  lost: { variant: "danger", label: "Lost" },
  abandoned: { variant: "default", label: "Abandoned" },
};

export function CallsPage() {
  const { addToast } = useToast();
  const [calls, setCalls] = useState(twilioMockService.getCalls());
  const stats = twilioMockService.getCallStats();
  const [filter, setFilter] = useState<string>("all");

  const filtered = calls.filter((c) => {
    if (filter === "all") return true;
    if (filter === "missed") return c.status === "missed" || c.status === "after_hours";
    if (filter === "inbound") return c.direction === "inbound";
    if (filter === "outbound") return c.direction === "outbound";
    return true;
  });

  function simulateInbound() {
    const randomContact = demoContacts[Math.floor(Math.random() * demoContacts.length)];
    const call = twilioMockService.simulateInboundCall(randomContact.id);
    setCalls(twilioMockService.getCalls());
    addToast({
      type: "warning",
      title: "Missed call simulated",
      description: `${call.callerName} called and nobody answered`,
    });
  }

  function simulateOutbound(contactId: string) {
    const call = twilioMockService.simulateOutboundCall(contactId);
    setCalls(twilioMockService.getCalls());
    const contact = getContactById(contactId);
    addToast({
      type: "success",
      title: "Call placed",
      description: `Outbound call to ${contact?.firstName} ${contact?.lastName} (${call.duration}s)`,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Calls</h1>
          <p className="text-sm text-gray-500 mt-0.5">Powered by Twilio (mock)</p>
        </div>
        <Button size="sm" onClick={simulateInbound}>
          <Play size={14} /> Simulate Missed Call
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Total Calls</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Missed</p>
          <p className="text-2xl font-bold text-danger-600 mt-1">{stats.missed}</p>
          <p className="text-xs text-gray-400">{stats.missedRate}% missed rate</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Responded</p>
          <p className="text-2xl font-bold text-success-600 mt-1">{stats.responded}</p>
          <p className="text-xs text-gray-400">{stats.responseRate}% response rate</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Total (incl simulated)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{calls.length}</p>
        </Card>
      </div>

      <div className="flex gap-2">
        {["all", "missed", "inbound", "outbound"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Card padding={false}>
        {filtered.length === 0 ? (
          <EmptyState title="No calls" description="No calls match this filter." />
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((call) => {
              const contact = getContactById(call.contactId);
              const badge = statusBadge[call.status] ?? { variant: "default" as const, label: call.status };
              return (
                <div key={call.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {call.direction === "inbound" ? (
                      call.status === "missed" || call.status === "after_hours" ? (
                        <PhoneMissed size={16} className="text-danger-500" />
                      ) : (
                        <PhoneIncoming size={16} className="text-success-500" />
                      )
                    ) : (
                      <PhoneOutgoing size={16} className="text-primary-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {call.callerName ?? contact ? `${contact?.firstName} ${contact?.lastName}` : call.callerNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {call.direction === "inbound" ? call.callerNumber : call.calledNumber}
                    </p>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <div className="text-right shrink-0 w-24">
                    {call.duration > 0 && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                        <Clock size={12} /> {Math.floor(call.duration / 60)}:{String(call.duration % 60).padStart(2, "0")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">{formatDistanceToNow(call.callTime, { addSuffix: true })}</p>
                  </div>
                  {(call.status === "missed" || call.status === "after_hours") && contact && (
                    <Button variant="ghost" size="sm" onClick={() => simulateOutbound(call.contactId)}>
                      <Phone size={12} /> Call Back
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
