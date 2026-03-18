"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type BusinessSettings = {
  name: string;
  timezone: string;
  staleEstimateDays: number;
  attributionWindowDays: number;
  highValueThreshold: number;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function SettingsModule({
  business,
  users,
}: {
  business: BusinessSettings;
  users: UserRow[];
}) {
  const [status, setStatus] = useState<string | null>(null);

  async function saveBusiness() {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: business.name,
        timezone: business.timezone,
        staleEstimateDays: business.staleEstimateDays,
        attributionWindowDays: business.attributionWindowDays,
        highValueThreshold: business.highValueThreshold,
      }),
    });
    setStatus(response.ok ? "Business profile saved." : "Failed to save profile.");
  }

  return (
    <Tabs defaultValue="business-profile">
      <TabsList className="mb-4 flex h-auto flex-wrap gap-1 bg-transparent p-0">
        <TabsTrigger value="business-profile">Business Profile</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="messaging">Messaging</TabsTrigger>
        <TabsTrigger value="attribution-rules">Attribution Rules</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="business-profile">
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Business name</Label>
              <Input defaultValue={business.name} />
            </div>
            <div className="space-y-1">
              <Label>Timezone</Label>
              <Input defaultValue={business.timezone} />
            </div>
            <div className="space-y-1">
              <Label>Stale estimate days</Label>
              <Input defaultValue={business.staleEstimateDays} type="number" />
            </div>
            <div className="space-y-1">
              <Label>High value threshold</Label>
              <Input defaultValue={business.highValueThreshold} type="number" />
            </div>
            <div className="md:col-span-2">
              <Button onClick={saveBusiness}>Save profile</Button>
              {status ? <p className="mt-2 text-sm text-slate-600">{status}</p> : null}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-md border border-slate-200 p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <p className="capitalize text-slate-700">{user.role}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="permissions">
        <Card>
          <CardHeader>
            <CardTitle>Permissions matrix</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            owner: full access · manager: workflows/campaigns/templates/reports/opportunities ·
            csr: opportunities/notes/contacts/calls · readonly: dashboard + reports.
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="messaging">
        <Card>
          <CardHeader>
            <CardTitle>Messaging</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Twilio sender ID, quiet hours, opt-out handling, and template compliance toggles are
            scaffolded for pilot.
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attribution-rules">
        <Card>
          <CardHeader>
            <CardTitle>Attribution Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Attribution window default is {business.attributionWindowDays} days. Bookings can be
            tagged as direct or influenced.
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="compliance">
        <Card>
          <CardHeader>
            <CardTitle>Compliance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Track message consent, opt-out, and audit trails through MessageEvent and ActivityLog
            tables.
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Alert channels for stale response time and campaign anomalies are configurable in a
            future iteration.
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Billing plan scaffold: pilot tenant, active seats, and monthly recovered revenue
            benchmark.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
