"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { demoBusiness, demoUsers } from "@/lib/demo-data";
import {
  Building2,
  Users,
  Shield,
  MessageSquare,
  Target,
  FileCheck,
  Bell,
  CreditCard,
} from "lucide-react";

const settingsSections = [
  { id: "business", label: "Business Profile", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "permissions", label: "Permissions", icon: Shield },
  { id: "messaging", label: "Messaging", icon: MessageSquare },
  { id: "attribution", label: "Attribution Rules", icon: Target },
  { id: "compliance", label: "Compliance", icon: FileCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("business");

  return (
    <div>
      <TopBar title="Settings" />
      <div className="flex">
        {/* Settings Nav */}
        <nav className="w-56 border-r border-border bg-white p-4 min-h-[calc(100vh-64px)]">
          <div className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Settings Content */}
        <div className="flex-1 p-6 space-y-6 max-w-3xl">
          {activeSection === "business" && (
            <>
              <h2 className="text-lg font-semibold">Business Profile</h2>
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Business Name</label>
                      <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.name} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Phone</label>
                      <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.phone || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Email</label>
                      <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.email || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Website</label>
                      <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue="https://northshoreheating.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Address</label>
                      <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.address || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">City</label>
                      <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.city || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">State</label>
                      <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.state || ""} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Timezone</label>
                      <select className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.timezone}>
                        <option value="America/Detroit">America/Detroit (EST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="America/Chicago">America/Chicago (CST)</option>
                        <option value="America/Denver">America/Denver (MST)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "users" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Users</h2>
                <Button size="sm"><Users className="h-4 w-4 mr-1" /> Invite User</Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Role</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {demoUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{user.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status="active" /></td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "permissions" && (
            <>
              <h2 className="text-lg font-semibold">Permissions</h2>
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {["owner", "manager", "csr", "readonly"].map((role) => (
                      <div key={role} className="border border-border rounded-lg p-4">
                        <h3 className="text-sm font-semibold capitalize mb-2">{role}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "View Dashboard", "Manage Opportunities", "Manage Contacts",
                            "Send Messages", "Launch Campaigns", "View Reports",
                            "Manage Templates", "Manage Settings", "Manage Users",
                          ].map((perm) => {
                            const enabled = role === "owner" || (role === "manager" && perm !== "Manage Users") ||
                              (role === "csr" && ["View Dashboard", "Manage Opportunities", "Manage Contacts", "Send Messages"].includes(perm)) ||
                              (role === "readonly" && perm === "View Dashboard");
                            return (
                              <label key={perm} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked={enabled} className="rounded border-gray-300" />
                                {perm}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "messaging" && (
            <>
              <h2 className="text-lg font-semibold">Messaging Settings</h2>
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Default SMS Number</label>
                    <input className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue="+13135550100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Auto-Reply for Missed Calls</label>
                    <select className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background">
                      <option>Missed Call Auto-Reply</option>
                      <option>Custom</option>
                      <option>None</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <label className="text-sm">Send auto-reply for after-hours calls</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <label className="text-sm">Include booking link in auto-reply</label>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "attribution" && (
            <>
              <h2 className="text-lg font-semibold">Attribution Rules</h2>
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Attribution Window (days)</label>
                      <input type="number" className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.attributionWindowDays} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Stale Estimate Threshold (days)</label>
                      <input type="number" className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.staleEstimateDays} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">High Value Threshold ($)</label>
                      <input type="number" className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.highValueThreshold} />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Missed Call Suppression (hours)</label>
                      <input type="number" className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background" defaultValue={demoBusiness.missedCallSuppressionHours} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Save Rules</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "compliance" && (
            <>
              <h2 className="text-lg font-semibold">Compliance</h2>
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <label className="text-sm">Include opt-out instructions in all SMS messages</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <label className="text-sm">Honor TCPA quiet hours (before 8am / after 9pm local time)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <label className="text-sm">Log all opt-out requests</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Opt-Out Response Template</label>
                    <textarea className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background min-h-[60px]" defaultValue="You have been unsubscribed from North Shore Heating & Plumbing messages. Reply START to re-subscribe." />
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm">Save</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "notifications" && (
            <>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <h3 className="text-sm font-semibold">Email Notifications</h3>
                  {[
                    { label: "New missed call", defaultChecked: true },
                    { label: "Estimate goes stale", defaultChecked: true },
                    { label: "Customer replies to SMS", defaultChecked: true },
                    { label: "Booking created", defaultChecked: true },
                    { label: "High-value opportunity created", defaultChecked: true },
                    { label: "Campaign completed", defaultChecked: false },
                    { label: "Weekly report summary", defaultChecked: true },
                  ].map((notif) => (
                    <div key={notif.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{notif.label}</span>
                      <input type="checkbox" defaultChecked={notif.defaultChecked} className="rounded border-gray-300" />
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button size="sm">Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "billing" && (
            <>
              <h2 className="text-lg font-semibold">Billing</h2>
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Growth Plan</h3>
                        <p className="text-sm text-muted-foreground">Includes all features + 5 users</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$299<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Current Period</p>
                      <p className="text-sm font-medium">Mar 1 - Mar 31, 2026</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">SMS Used</p>
                      <p className="text-sm font-medium">847 / 2,000</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Manage Subscription</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
