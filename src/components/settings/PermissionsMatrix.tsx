"use client";

import type { Role } from "@/types/revenue";
import { type Permission, hasPermission } from "@/lib/permissions";

const DISPLAY_PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "dashboard:view", label: "View Dashboard" },
  { key: "opportunities:view", label: "View Opportunities" },
  { key: "opportunities:edit", label: "Edit Opportunities" },
  { key: "campaigns:view", label: "View Campaigns" },
  { key: "campaigns:edit", label: "Edit Campaigns" },
  { key: "contacts:import", label: "Import Contacts" },
  { key: "reports:view", label: "View Reports" },
  { key: "settings:edit", label: "Edit Settings" },
  { key: "integrations:manage", label: "Manage Integrations" },
];

const ROLES: Role[] = ["OWNER", "MANAGER", "STAFF"];

export function PermissionsMatrix() {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Permissions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 pr-4 text-left font-medium">Permission</th>
              {ROLES.map((role) => (
                <th key={role} className="pb-2 px-4 text-center font-medium">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISPLAY_PERMISSIONS.map((perm) => (
              <tr key={perm.key} className="border-b">
                <td className="py-2 pr-4">{perm.label}</td>
                {ROLES.map((role) => (
                  <td key={role} className="py-2 px-4 text-center">
                    {hasPermission(role, perm.key) ? "✓" : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
