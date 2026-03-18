import type { Metadata } from "next";
import { BusinessProfileForm } from "@/components/settings/BusinessProfileForm";
import { UsersTable } from "@/components/settings/UsersTable";
import { AttributionRulesForm } from "@/components/settings/AttributionRulesForm";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your business configuration</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Business Profile</h2>
        <BusinessProfileForm />
      </section>

      <hr className="border-slate-100" />

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Team Members</h2>
        <UsersTable />
      </section>

      <hr className="border-slate-100" />

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Attribution Rules</h2>
        <AttributionRulesForm />
      </section>

      <hr className="border-slate-100" />

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h2>
        <NotificationSettingsForm />
      </section>
    </div>
  );
}
