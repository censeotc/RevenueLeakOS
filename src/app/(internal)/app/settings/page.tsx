import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBusiness, getUsers } from "@/lib/data/selectors";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const business = getBusiness();
  const users = getUsers();

  return (
    <>
      <PageHeader
        eyebrow="Tenant controls"
        title="Settings"
        description="Business profile, users, permissions, messaging, attribution, compliance, notifications, and billing controls."
      />

      <Tabs defaultValue="business-profile" className="space-y-4">
        <TabsList>
          {[
            "business-profile",
            "users",
            "permissions",
            "messaging",
            "attribution-rules",
            "compliance",
            "notifications",
            "billing",
          ].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab.replace(/-/g, " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="business-profile">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Core business defaults loaded from the demo tenant</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Business</p>
                <p className="font-medium text-slate-900">{business.name}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Timezone</p>
                <p className="font-medium text-slate-900">{business.timezone}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Stale estimate threshold</p>
                <p className="font-medium text-slate-900">{business.staleEstimateDays} days</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">High-value threshold</p>
                <p className="font-medium text-slate-900">{formatCurrency(business.highValueThreshold)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Seeded internal users and role assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <StatusBadge value={user.role} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {[
          {
            value: "permissions",
            title: "Permissions",
            description: "Owner full access, managers run workflows, CSRs update ops, readonly sees dashboard and reports only.",
          },
          {
            value: "messaging",
            title: "Messaging",
            description: "Twilio mock service is active for SMS automation, reply simulation, and delivery previews.",
          },
          {
            value: "attribution-rules",
            title: "Attribution Rules",
            description: `Attribution window defaults to ${business.attributionWindowDays} days with direct and influenced booking support.`,
          },
          {
            value: "compliance",
            title: "Compliance",
            description: "Scaffold for consent language, quiet hours, opt-out handling, and audit-ready message policies.",
          },
          {
            value: "notifications",
            title: "Notifications",
            description: "Scaffold for owner alerts, SLA warnings, stale estimate escalations, and digest subscriptions.",
          },
          {
            value: "billing",
            title: "Billing",
            description: "Scaffold for plan controls, usage summaries, invoice history, and future subscription management.",
          },
        ].map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.title}</CardTitle>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  This section is scaffolded for the MVP and keeps room for production-grade controls without breaking the current demo experience.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
