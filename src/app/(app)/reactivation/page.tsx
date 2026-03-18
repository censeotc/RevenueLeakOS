"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { demoContacts, demoOpportunities } from "@/lib/demo-data";
import { formatCurrency, daysSince } from "@/lib/utils";
import {
  Users,
  Wrench,
  CreditCard,
  RefreshCw,
  Megaphone,
  ArrowRight,
} from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  criteria: string;
  contacts: typeof demoContacts;
  estimatedValue: number;
}

export default function ReactivationPage() {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [launchedCampaigns, setLaunchedCampaigns] = useState<Set<string>>(new Set());

  const noService12Months = demoContacts.filter(
    (c) => c.lastServiceDate && daysSince(c.lastServiceDate) > 365
  );
  const maintenanceDue = demoContacts.filter(
    (c) => c.lastServiceDate && daysSince(c.lastServiceDate) > 180 && c.tags.includes("maintenance")
  );
  const membershipRenewal = demoContacts.filter(
    (c) => c.lastServiceDate && daysSince(c.lastServiceDate) > 330 && c.lifetimeValue > 3000
  );
  const replacementCycle = demoContacts.filter(
    (c) => c.lastServiceDate && daysSince(c.lastServiceDate) > 450 && c.tags.includes("hvac")
  );

  const segments: Segment[] = [
    {
      id: "no_service",
      name: "No Service in 12+ Months",
      description: "Customers who haven't booked any service in over a year",
      icon: <Users className="h-6 w-6" />,
      criteria: "Last service > 12 months ago",
      contacts: noService12Months,
      estimatedValue: noService12Months.reduce((sum, c) => sum + Math.round(c.lifetimeValue * 0.15), 0),
    },
    {
      id: "maintenance",
      name: "Maintenance Due",
      description: "Customers with maintenance-tagged services overdue",
      icon: <Wrench className="h-6 w-6" />,
      criteria: "Maintenance tag + last service > 6 months",
      contacts: maintenanceDue,
      estimatedValue: maintenanceDue.reduce((sum, c) => sum + 350, 0),
    },
    {
      id: "membership",
      name: "Membership Renewal",
      description: "High-value customers approaching renewal window",
      icon: <CreditCard className="h-6 w-6" />,
      criteria: "Lifetime value > $3,000 + last service > 11 months",
      contacts: membershipRenewal,
      estimatedValue: membershipRenewal.reduce((sum, c) => sum + 600, 0),
    },
    {
      id: "replacement",
      name: "Replacement Cycle Candidates",
      description: "HVAC customers with aging equipment likely needing replacement",
      icon: <RefreshCw className="h-6 w-6" />,
      criteria: "HVAC tag + last service > 15 months",
      contacts: replacementCycle,
      estimatedValue: replacementCycle.reduce((sum, c) => sum + 4500, 0),
    },
  ];

  const activeSegment = segments.find((s) => s.id === selectedSegment);

  const reactivationOpps = demoOpportunities.filter((o) => o.type === "reactivation");

  return (
    <div>
      <TopBar title="Reactivation" />
      <div className="p-6 space-y-6">
        {/* Segment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {segments.map((seg) => (
            <Card
              key={seg.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSegment === seg.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardContent
                className="pt-4"
                onClick={() => setSelectedSegment(selectedSegment === seg.id ? null : seg.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg p-2 bg-primary/10 text-primary">
                    {seg.icon}
                  </div>
                  <span className="text-2xl font-bold">{seg.contacts.length}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{seg.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{seg.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Value</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(seg.estimatedValue)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={launchedCampaigns.has(seg.id) ? "secondary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLaunchedCampaigns((prev) => {
                        const next = new Set(prev);
                        next.add(seg.id);
                        return next;
                      });
                    }}
                    disabled={launchedCampaigns.has(seg.id)}
                  >
                    {launchedCampaigns.has(seg.id) ? (
                      "Launched"
                    ) : (
                      <>
                        <Megaphone className="h-3.5 w-3.5" />
                        Launch
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Table */}
        {activeSegment && (
          <Card>
            <CardHeader>
              <CardTitle>{activeSegment.name} - {activeSegment.contacts.length} contacts</CardTitle>
              <p className="text-xs text-muted-foreground">{activeSegment.criteria}</p>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Contact</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Phone</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Last Service</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Lifetime Value</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Tags</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Est. Recovery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeSegment.contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{contact.firstName} {contact.lastName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{contact.phone}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {contact.lastServiceDate ? `${daysSince(contact.lastServiceDate)} days ago` : "Never"}
                      </td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(contact.lifetimeValue)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600">
                        {formatCurrency(Math.round(contact.lifetimeValue * 0.15))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Existing Reactivation Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Active Reactivation Opportunities ({reactivationOpps.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Opportunity</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Est. Value</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reactivationOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{opp.title}</div>
                      <div className="text-xs text-muted-foreground">{opp.description}</div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={opp.status} /></td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(opp.estimatedValue)}</td>
                    <td className="px-4 py-3 font-medium text-emerald-600">
                      {opp.actualValue ? formatCurrency(opp.actualValue) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
