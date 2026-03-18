import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSettingsView } from "@/lib/demo-data";
import { requireRouteAccess } from "@/lib/guards";

export default async function SettingsPage() {
  await requireRouteAccess("/app/settings");
  const data = getSettingsView();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">Business profile, permissions, messaging, and billing controls</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Business Profile</CardTitle><CardDescription>Default operating values for the demo tenant.</CardDescription></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Timezone</span><span>{data.defaults.timezone}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Stale estimate days</span><span>{data.defaults.staleEstimateDays}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Attribution window</span><span>{data.defaults.attributionWindowDays} days</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">High-value threshold</span><span>${data.defaults.highValueThreshold.toLocaleString()}</span></div>
            <div className="flex items-center justify-between gap-3"><span className="text-zinc-500">Duplicate missed-call suppression</span><span>{data.defaults.duplicateMissedCallWindowHours} hours</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Users & Permissions</CardTitle><CardDescription>Seeded users plus the role matrix used by the internal app.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {data.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4">
                <div><p className="font-medium">{user.name}</p><p className="text-sm text-zinc-500">{user.email}</p></div>
                <Badge variant={user.role === "owner" ? "info" : "secondary"}>{user.role}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Messaging", "Twilio-backed messaging defaults, reply handling, and quiet hours."],
          ["Attribution Rules", "Windowing, direct vs influenced credit, and high-value thresholds."],
          ["Compliance", "Consent language, opt-out logging, and message retention."],
          ["Notifications", "Escalations for stale estimates, missed callbacks, and campaign replies."],
          ["Billing", "Tenant billing scaffolding, plan state, and usage meters."],
          ["Permissions", "Role-based access controls for owners, managers, CSRs, and read-only users."],
        ].map(([title, description]) => (
          <Card key={title}><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>
        ))}
      </div>
    </div>
  );
}
