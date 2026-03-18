const demoUsers = [
  { id: "1", name: "Mike Johnson", email: "owner@demohvacpros.com", role: "OWNER", lastLogin: "2 hours ago" },
  { id: "2", name: "Sarah Williams", email: "manager@demohvacpros.com", role: "MANAGER", lastLogin: "1 day ago" },
];

export function UsersTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Login</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {demoUsers.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">{user.lastLogin}</td>
              <td className="px-4 py-3">
                <button className="text-xs text-slate-500 hover:text-slate-700">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-slate-100">
        <button className="text-sm text-blue-600 hover:text-blue-700">+ Invite team member</button>
      </div>
    </div>
  );
}
