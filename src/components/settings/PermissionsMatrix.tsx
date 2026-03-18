const permissions = [
  { feature: "View Dashboard", owner: true, admin: true, manager: true, member: true, readOnly: true },
  { feature: "Manage Opportunities", owner: true, admin: true, manager: true, member: true, readOnly: false },
  { feature: "Send SMS / Email", owner: true, admin: true, manager: true, member: false, readOnly: false },
  { feature: "Manage Campaigns", owner: true, admin: true, manager: true, member: false, readOnly: false },
  { feature: "Manage Templates", owner: true, admin: true, manager: false, member: false, readOnly: false },
  { feature: "Manage Contacts", owner: true, admin: true, manager: true, member: false, readOnly: false },
  { feature: "View Reports", owner: true, admin: true, manager: true, member: false, readOnly: true },
  { feature: "Manage Integrations", owner: true, admin: true, manager: false, member: false, readOnly: false },
  { feature: "Manage Users", owner: true, admin: false, manager: false, member: false, readOnly: false },
  { feature: "Billing & Settings", owner: true, admin: false, manager: false, member: false, readOnly: false },
];

const roles = ["owner", "admin", "manager", "member", "readOnly"] as const;
const roleLabels = { owner: "Owner", admin: "Admin", manager: "Manager", member: "Member", readOnly: "Read-only" };

export function PermissionsMatrix() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Feature</th>
            {roles.map((role) => (
              <th key={role} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
                {roleLabels[role]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {permissions.map((perm) => (
            <tr key={perm.feature} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-700">{perm.feature}</td>
              {roles.map((role) => (
                <td key={role} className="px-4 py-3 text-center">
                  {perm[role] ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-slate-200">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
