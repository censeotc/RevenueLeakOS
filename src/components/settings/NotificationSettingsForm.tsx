import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NotificationPreference } from "@/types/revenue";

export function NotificationSettingsForm({ preferences }: { preferences: NotificationPreference[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification settings</CardTitle>
        <CardDescription>Control which alerts reach the team and where.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {preferences.map((preference) => (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 text-sm" key={preference.id}>
            <div>
              <p className="font-medium text-slate-900">{preference.label}</p>
              <p className="text-slate-500">{preference.channel}</p>
            </div>
            <span className={preference.enabled ? 'text-emerald-600' : 'text-slate-400'}>{preference.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
