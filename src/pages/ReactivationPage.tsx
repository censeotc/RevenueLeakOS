import { RotateCcw, UserCheck, DollarSign, Clock, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { demoContacts, demoOpportunities, getContactById } from "@/data/seed";

export function ReactivationPage() {
  const { addToast } = useToast();

  const reactivationOpps = demoOpportunities.filter((o) => o.type === "reactivation");
  const dormantContacts = demoContacts.filter((c) => {
    if (!c.lastServiceDate) return false;
    const daysSince = Math.floor((Date.now() - c.lastServiceDate.getTime()) / 86400000);
    return daysSince > 365;
  });

  const segments = [
    {
      name: "12-18 Month Dormant",
      description: "Customers who haven't had service in 12-18 months",
      contacts: demoContacts.filter((c) => {
        if (!c.lastServiceDate) return false;
        const days = Math.floor((Date.now() - c.lastServiceDate.getTime()) / 86400000);
        return days >= 365 && days < 540;
      }),
    },
    {
      name: "18+ Month Dormant",
      description: "Long-dormant customers, potential churn risk",
      contacts: demoContacts.filter((c) => {
        if (!c.lastServiceDate) return false;
        const days = Math.floor((Date.now() - c.lastServiceDate.getTime()) / 86400000);
        return days >= 540;
      }),
    },
    {
      name: "High-Value Dormant",
      description: "Dormant customers with lifetime value > $5,000",
      contacts: demoContacts.filter((c) => {
        if (!c.lastServiceDate) return false;
        const days = Math.floor((Date.now() - c.lastServiceDate.getTime()) / 86400000);
        return days >= 365 && c.lifetimeValue > 5000;
      }),
    },
  ];

  const totalDormantValue = dormantContacts.reduce((s, c) => s + c.lifetimeValue, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reactivation</h1>
          <p className="text-sm text-gray-500 mt-0.5">Win back dormant customers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Dormant Customers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{dormantContacts.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Lifetime Value at Risk</p>
          <p className="text-2xl font-bold text-warning-600 mt-1">${totalDormantValue.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Active Reactivations</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">
            {reactivationOpps.filter((o) => !["won", "lost"].includes(o.status)).length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-medium">Won Back</p>
          <p className="text-2xl font-bold text-success-600 mt-1">
            {reactivationOpps.filter((o) => o.status === "won" || o.status === "booked").length}
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Segments</h2>
        {segments.map((seg) => {
          const segValue = seg.contacts.reduce((s, c) => s + c.lifetimeValue, 0);
          return (
            <Card key={seg.name}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{seg.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{seg.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><UserCheck size={12} /> {seg.contacts.length} contacts</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} /> ${segValue.toLocaleString()} lifetime value</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => addToast({ type: "success", title: "Campaign queued", description: `Reactivation outreach for ${seg.contacts.length} contacts` })}
                >
                  <Send size={12} /> Start Campaign
                </Button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {seg.contacts.slice(0, 6).map((c) => (
                    <div key={c.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-semibold">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <span className="text-xs text-gray-700">{c.firstName} {c.lastName}</span>
                      <span className="text-[10px] text-gray-400">${c.lifetimeValue.toLocaleString()}</span>
                    </div>
                  ))}
                  {seg.contacts.length > 6 && (
                    <div className="flex items-center px-2.5 py-1.5 text-xs text-gray-400">
                      +{seg.contacts.length - 6} more
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Reactivation Opportunities</h2>
        <Card padding={false}>
          <div className="divide-y divide-gray-100">
            {reactivationOpps.map((opp) => {
              const contact = getContactById(opp.contactId);
              return (
                <div key={opp.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{opp.title}</p>
                    <p className="text-xs text-gray-500">{opp.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium text-gray-700">${opp.estimatedValue.toLocaleString()}</span>
                    <Badge
                      variant={
                        opp.status === "won" || opp.status === "booked"
                          ? "success"
                          : opp.status === "new"
                          ? "warning"
                          : "primary"
                      }
                    >
                      {opp.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
