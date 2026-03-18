"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currency } from "@/lib/utils";

const defaultSegments = [
  "no service in 12+ months",
  "maintenance due",
  "membership renewal",
  "replacement cycle candidates",
] as const;

type ContactRow = {
  id: string;
  fullName: string;
  phone: string;
  lifetimeValue: number | null;
  lastServiceAt: string | null;
};

export function ReactivationModule({ contacts }: { contacts: ContactRow[] }) {
  const [segment, setSegment] = useState<(typeof defaultSegments)[number]>(defaultSegments[0]);
  const [message, setMessage] = useState<string | null>(null);

  const estimatedValue = useMemo(
    () =>
      contacts.reduce((sum, contact) => sum + (contact.lifetimeValue ? contact.lifetimeValue * 0.2 : 700), 0),
    [contacts],
  );

  async function launchCampaign() {
    const response = await fetch("/api/workflows/reactivation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ segment, campaignName: `Reactivation - ${segment}` }),
    });
    if (!response.ok) {
      setMessage("Could not launch campaign.");
      return;
    }
    const data = await response.json();
    setMessage(
      `Campaign launched. Created ${data.opportunitiesCreated ?? 0} reactivation opportunities.`,
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <div className="space-y-4 xl:col-span-2">
        {defaultSegments.map((candidate) => (
          <Card
            key={candidate}
            className={candidate === segment ? "border-slate-900 ring-1 ring-slate-900" : undefined}
          >
            <CardHeader>
              <CardTitle className="text-base capitalize">{candidate}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant={candidate === segment ? "default" : "outline"}
                onClick={() => setSegment(candidate)}
              >
                Select segment
              </Button>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader>
            <CardTitle>Estimated value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{currency(estimatedValue)}</p>
            <p className="mt-1 text-sm text-slate-600">Projected influenced revenue from this segment.</p>
            <Button className="mt-4" onClick={launchCampaign}>
              Launch campaign
            </Button>
            {message ? <p className="mt-2 text-xs text-slate-600">{message}</p> : null}
          </CardContent>
        </Card>
      </div>
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Segment preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last service</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.slice(0, 12).map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <p className="font-medium text-slate-900">{contact.fullName}</p>
                    <Badge variant="warning" className="mt-1">
                      Dormant
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    {contact.lastServiceAt
                      ? new Date(contact.lastServiceAt).toLocaleDateString("en-US")
                      : "Unknown"}
                  </TableCell>
                  <TableCell>{currency(contact.lifetimeValue ?? 800)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
