import { AttributionRulesForm } from "@/components/settings/AttributionRulesForm";
import { BusinessProfileForm } from "@/components/settings/BusinessProfileForm";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";
import { PermissionsMatrix } from "@/components/settings/PermissionsMatrix";
import { UsersTable } from "@/components/settings/UsersTable";
import { PageHeading } from "@/components/shared/PageHeading";
import { businessProfile, notificationPreferences, permissionMatrix, users } from "@/data/demoData";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Settings" title="Configure business rules, users, and alerting" description="Manage the operating assumptions that drive routing, reporting, and access control." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <BusinessProfileForm profile={businessProfile} />
        <AttributionRulesForm profile={businessProfile} />
      </div>
      <UsersTable users={users} />
      <PermissionsMatrix rows={permissionMatrix} />
      <NotificationSettingsForm preferences={notificationPreferences} />
    </div>
  );
}
