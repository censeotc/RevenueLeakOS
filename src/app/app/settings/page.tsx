"use client";

import { useState } from "react";
import { Building2, Users, Shield, MessageSquare, BarChart2, FileText, Bell, CreditCard, Save, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "business", label: "Business Profile", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "permissions", label: "Permissions", icon: Shield },
  { id: "messaging", label: "Messaging", icon: MessageSquare },
  { id: "attribution", label: "Attribution Rules", icon: BarChart2 },
  { id: "compliance", label: "Compliance", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const DEMO_USERS = [
  { id: "u1", name: "Mike Harrington", email: "owner@northshoreht.com", role: "owner", lastActive: "Today" },
  { id: "u2", name: "Sarah Chen", email: "manager@northshoreht.com", role: "manager", lastActive: "Today" },
  { id: "u3", name: "James Rivera", email: "csr@northshoreht.com", role: "csr", lastActive: "Today" },
];

const ROLE_COLORS = {
  owner: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  csr: "bg-green-100 text-green-700",
  readonly: "bg-gray-100 text-gray-600",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("business");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and business preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "business" && (
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                    <Input defaultValue="North Shore Heating & Plumbing" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                    <Input defaultValue="Multi-Trade (HVAC, Plumbing, Electrical)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <Input defaultValue="(734) 555-0100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <Input defaultValue="info@northshoreht.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <Input defaultValue="1420 Harbor Dr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City / State / Zip</label>
                    <Input defaultValue="Grosse Pointe, MI 48230" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                    <Input defaultValue="America/Detroit (Eastern)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                    <Input defaultValue="https://northshoreht.com" />
                  </div>
                </div>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Invite User
                </Button>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2">User</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2">Role</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2">Last Active</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_USERS.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100">
                        <td className="py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", ROLE_COLORS[user.role as keyof typeof ROLE_COLORS])}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-slate-500">{user.lastActive}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">Edit</Button>
                            {user.role !== "owner" && (
                              <Button size="sm" variant="ghost" className="text-red-500">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {activeTab === "permissions" && (
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Feature</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Owner</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Manager</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">CSR</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-500 uppercase">Readonly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Dashboard", owner: true, manager: true, csr: true, readonly: true },
                      { feature: "Opportunities", owner: true, manager: true, csr: true, readonly: false },
                      { feature: "Calls", owner: true, manager: true, csr: true, readonly: false },
                      { feature: "Estimates", owner: true, manager: true, csr: false, readonly: false },
                      { feature: "Campaigns", owner: true, manager: true, csr: false, readonly: false },
                      { feature: "Reports", owner: true, manager: true, csr: false, readonly: true },
                      { feature: "Templates", owner: true, manager: true, csr: false, readonly: false },
                      { feature: "Integrations", owner: true, manager: false, csr: false, readonly: false },
                      { feature: "Settings", owner: true, manager: false, csr: false, readonly: false },
                      { feature: "Billing", owner: true, manager: false, csr: false, readonly: false },
                    ].map((row) => (
                      <tr key={row.feature} className="border-b border-slate-100">
                        <td className="py-2.5 text-slate-700">{row.feature}</td>
                        {["owner", "manager", "csr", "readonly"].map((role) => (
                          <td key={role} className="py-2.5 text-center">
                            {row[role as keyof typeof row] ? (
                              <span className="text-green-500 text-lg">✓</span>
                            ) : (
                              <span className="text-slate-300 text-lg">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {activeTab === "messaging" && (
            <Card>
              <CardHeader>
                <CardTitle>Messaging Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Twilio From Number</label>
                    <Input defaultValue="+1 (734) 555-0199" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Hours</label>
                    <Input defaultValue="Mon–Fri 7:00 AM – 6:00 PM" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Missed Call Suppression Window</label>
                    <Input defaultValue="240 minutes (4 hours)" />
                    <p className="text-xs text-slate-400 mt-1">Duplicate missed calls from the same number are suppressed within this window</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Opt-Out Keyword</label>
                    <Input defaultValue="STOP" />
                  </div>
                </div>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "attribution" && (
            <Card>
              <CardHeader>
                <CardTitle>Attribution Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Attribution Window</label>
                    <Input defaultValue="14 days" />
                    <p className="text-xs text-slate-400 mt-1">Bookings within this window are attributed to the recovery workflow</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">High Value Threshold</label>
                    <Input defaultValue="$2,500" />
                    <p className="text-xs text-slate-400 mt-1">Opportunities above this amount are flagged as high-value</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stale Estimate Threshold</label>
                    <Input defaultValue="7 days" />
                    <p className="text-xs text-slate-400 mt-1">Estimates without a response after this period are marked stale</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dormant Customer Threshold</label>
                    <Input defaultValue="365 days" />
                    <p className="text-xs text-slate-400 mt-1">Customers with no service activity are marked dormant</p>
                  </div>
                </div>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {(activeTab === "compliance" || activeTab === "notifications" || activeTab === "billing") && (
            <Card>
              <CardHeader>
                <CardTitle>{TABS.find((t) => t.id === activeTab)?.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-400">
                  <div className="text-4xl mb-3">⚙️</div>
                  <p className="text-sm font-medium text-slate-600">Coming soon</p>
                  <p className="text-xs mt-1">This section is under development</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
