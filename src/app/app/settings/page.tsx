"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Building2,
  Users,
  Shield,
  MessageSquare,
  Target,
  Scale,
  Bell,
  CreditCard,
  Plus,
  Check,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/layout/page-header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { DEMO_BUSINESS, DEMO_USERS } from "@/lib/demo-data";
import type { DemoBusiness, DemoUser } from "@/lib/demo-data";
import { cn, formatCurrency } from "@/lib/utils";

type SettingsTab =
  | "profile"
  | "users"
  | "permissions"
  | "messaging"
  | "attribution"
  | "compliance"
  | "notifications"
  | "billing";

const TABS: { value: SettingsTab; label: string; icon: React.ElementType }[] = [
  { value: "profile", label: "Business Profile", icon: Building2 },
  { value: "users", label: "Users", icon: Users },
  { value: "permissions", label: "Permissions", icon: Shield },
  { value: "messaging", label: "Messaging", icon: MessageSquare },
  { value: "attribution", label: "Attribution Rules", icon: Target },
  { value: "compliance", label: "Compliance", icon: Scale },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "billing", label: "Billing", icon: CreditCard },
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Detroit",
  "America/Indiana/Indianapolis",
  "America/Anchorage",
  "Pacific/Honolulu",
];

const INDUSTRIES = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "roofing", label: "Roofing" },
  { value: "landscaping", label: "Landscaping" },
  { value: "pest_control", label: "Pest Control" },
  { value: "cleaning", label: "Cleaning" },
  { value: "multi_trade", label: "Multi-Trade" },
  { value: "other", label: "Other" },
];

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  manager: "Manager",
  csr: "CSR",
  readonly: "Read Only",
};

const PERMISSION_ROWS = [
  "Dashboard",
  "Opportunities",
  "Calls",
  "Estimates",
  "Campaigns",
  "Contacts",
  "Reports",
  "Templates",
  "Integrations",
  "Settings",
];

const PERMISSION_MATRIX: Record<string, Record<string, boolean>> = {
  Dashboard: { owner: true, manager: true, csr: true, readonly: true },
  Opportunities: { owner: true, manager: true, csr: true, readonly: false },
  Calls: { owner: true, manager: true, csr: true, readonly: false },
  Estimates: { owner: true, manager: true, csr: false, readonly: false },
  Campaigns: { owner: true, manager: true, csr: false, readonly: false },
  Contacts: { owner: true, manager: true, csr: true, readonly: false },
  Reports: { owner: true, manager: true, csr: false, readonly: true },
  Templates: { owner: true, manager: true, csr: false, readonly: false },
  Integrations: { owner: true, manager: false, csr: false, readonly: false },
  Settings: { owner: true, manager: false, csr: false, readonly: false },
};

const HOURS_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return { value: `${String(hour).padStart(2, "0")}:00`, label: `${h}:00 ${ampm}` };
});

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Business Profile state
  const [business, setBusiness] = useState<DemoBusiness>({ ...DEMO_BUSINESS });

  // Users state
  const [users, setUsers] = useState<DemoUser[]>([...DEMO_USERS]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("csr");

  // Messaging state
  const [fromNumber, setFromNumber] = useState("+12485551000");
  const [autoReply, setAutoReply] = useState(true);
  const [msgStartTime, setMsgStartTime] = useState("08:00");
  const [msgEndTime, setMsgEndTime] = useState("20:00");
  const [afterHoursMsg, setAfterHoursMsg] = useState(
    "Thanks for reaching out! Our office hours are Mon-Fri 8AM-8PM. We'll get back to you first thing in the morning."
  );
  const [smsSignature, setSmsSignature] = useState(
    "- North Shore Heating & Plumbing"
  );

  // Attribution state
  const [attributionWindow, setAttributionWindow] = useState(14);
  const [staleThreshold, setStaleThreshold] = useState(7);
  const [highValueThreshold, setHighValueThreshold] = useState(2500);
  const [suppressionWindow, setSuppressionWindow] = useState(4);

  // Compliance state
  const [optOutKeywords, setOptOutKeywords] = useState(
    "STOP, UNSUBSCRIBE, CANCEL, END, QUIT"
  );
  const [consentTracking, setConsentTracking] = useState(true);
  const [tcpaMode, setTcpaMode] = useState(true);

  // Notifications state
  const [notifMissedCall, setNotifMissedCall] = useState(true);
  const [notifStaleEstimate, setNotifStaleEstimate] = useState(true);
  const [notifCampaignComplete, setNotifCampaignComplete] = useState(true);
  const [notifBookingConfirmed, setNotifBookingConfirmed] = useState(true);
  const [notifDailyDigest, setNotifDailyDigest] = useState(true);
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  function handleInviteUser() {
    const newUser: DemoUser = {
      id: `usr_${Date.now()}`,
      businessId: "biz_1",
      email: inviteEmail,
      name: inviteName,
      role: inviteRole as DemoUser["role"],
      avatarUrl: null,
      phone: "",
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("csr");
    setInviteDialogOpen(false);
  }

  function toggleUserActive(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your RevenueLeak OS workspace"
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab navigation */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible md:w-56 shrink-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors text-left",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Profile</CardTitle>
                <CardDescription>
                  Manage your business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="biz-name">Business Name</Label>
                    <Input
                      id="biz-name"
                      value={business.name}
                      onChange={(e) =>
                        setBusiness((b) => ({ ...b, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select
                      value={business.industry}
                      onValueChange={(v) =>
                        setBusiness((b) => ({
                          ...b,
                          industry: v as DemoBusiness["industry"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-phone">Phone</Label>
                    <Input
                      id="biz-phone"
                      value={business.phone}
                      onChange={(e) =>
                        setBusiness((b) => ({ ...b, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-email">Email</Label>
                    <Input
                      id="biz-email"
                      value={business.email}
                      onChange={(e) =>
                        setBusiness((b) => ({ ...b, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="biz-website">Website</Label>
                    <Input
                      id="biz-website"
                      value={business.website}
                      onChange={(e) =>
                        setBusiness((b) => ({ ...b, website: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="biz-address">Address</Label>
                    <Input
                      id="biz-address"
                      value={business.address}
                      onChange={(e) =>
                        setBusiness((b) => ({ ...b, address: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-city">City</Label>
                    <Input
                      id="biz-city"
                      value={business.city}
                      onChange={(e) =>
                        setBusiness((b) => ({ ...b, city: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="biz-state">State</Label>
                      <Input
                        id="biz-state"
                        value={business.state}
                        onChange={(e) =>
                          setBusiness((b) => ({ ...b, state: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biz-zip">ZIP</Label>
                      <Input
                        id="biz-zip"
                        value={business.zip}
                        onChange={(e) =>
                          setBusiness((b) => ({ ...b, zip: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={business.timezone}
                      onValueChange={(v) =>
                        setBusiness((b) => ({ ...b, timezone: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biz-logo">Logo URL</Label>
                    <Input
                      id="biz-logo"
                      value={business.logoUrl ?? ""}
                      onChange={(e) =>
                        setBusiness((b) => ({
                          ...b,
                          logoUrl: e.target.value || null,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">Users</CardTitle>
                  <CardDescription>Manage team members and roles</CardDescription>
                </div>
                <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Invite User
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {ROLE_LABELS[user.role] ?? user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "success" : "secondary"}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDistanceToNow(user.lastLoginAt, {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => toggleUserActive(user.id)}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "permissions" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Permissions</CardTitle>
                <CardDescription>
                  Control access levels for each role
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Feature</TableHead>
                      <TableHead className="text-center">Owner</TableHead>
                      <TableHead className="text-center">Manager</TableHead>
                      <TableHead className="text-center">CSR</TableHead>
                      <TableHead className="text-center">Read Only</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PERMISSION_ROWS.map((feature) => (
                      <TableRow key={feature}>
                        <TableCell className="font-medium">{feature}</TableCell>
                        {["owner", "manager", "csr", "readonly"].map((role) => (
                          <TableCell key={role} className="text-center">
                            {PERMISSION_MATRIX[feature]?.[role] ? (
                              <Check className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-red-400 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "messaging" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Messaging Settings</CardTitle>
                <CardDescription>
                  Configure SMS and messaging preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="from-number">Default &quot;From&quot; Number</Label>
                    <Input
                      id="from-number"
                      value={fromNumber}
                      onChange={(e) => setFromNumber(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Auto-Reply</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically reply to incoming messages
                      </p>
                    </div>
                    <Switch
                      checked={autoReply}
                      onCheckedChange={setAutoReply}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Messaging Hours</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select value={msgStartTime} onValueChange={setMsgStartTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HOURS_OPTIONS.map((h) => (
                            <SelectItem key={h.value} value={h.value}>
                              {h.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Select value={msgEndTime} onValueChange={setMsgEndTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HOURS_OPTIONS.map((h) => (
                            <SelectItem key={h.value} value={h.value}>
                              {h.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="after-hours-msg">After-Hours Message</Label>
                  <Textarea
                    id="after-hours-msg"
                    value={afterHoursMsg}
                    onChange={(e) => setAfterHoursMsg(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-sig">SMS Signature</Label>
                  <Textarea
                    id="sms-sig"
                    value={smsSignature}
                    onChange={(e) => setSmsSignature(e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "attribution" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attribution Rules</CardTitle>
                <CardDescription>
                  Configure how revenue recovery is tracked and attributed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="attr-window">
                      Attribution Window (days)
                    </Label>
                    <Input
                      id="attr-window"
                      type="number"
                      value={attributionWindow}
                      onChange={(e) =>
                        setAttributionWindow(Number(e.target.value))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days after outreach to attribute a booking
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stale-threshold">
                      Stale Estimate Threshold (days)
                    </Label>
                    <Input
                      id="stale-threshold"
                      type="number"
                      value={staleThreshold}
                      onChange={(e) =>
                        setStaleThreshold(Number(e.target.value))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before an estimate is considered stale
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="high-value">
                      High Value Threshold ($)
                    </Label>
                    <Input
                      id="high-value"
                      type="number"
                      value={highValueThreshold}
                      onChange={(e) =>
                        setHighValueThreshold(Number(e.target.value))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Opportunities above this amount are flagged as high value
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suppression">
                      Missed Call Suppression (hours)
                    </Label>
                    <Input
                      id="suppression"
                      type="number"
                      value={suppressionWindow}
                      onChange={(e) =>
                        setSuppressionWindow(Number(e.target.value))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Suppress duplicate follow-ups within this window
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "compliance" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance</CardTitle>
                <CardDescription>
                  Manage opt-out, DNC, and regulatory settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="opt-out">Opt-Out Keywords</Label>
                  <Textarea
                    id="opt-out"
                    value={optOutKeywords}
                    onChange={(e) => setOptOutKeywords(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated keywords that trigger automatic opt-out
                  </p>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">DNC List Import</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload a CSV file with phone numbers to add to your
                    Do Not Contact list.
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Import DNC List
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Consent Tracking</Label>
                      <p className="text-xs text-muted-foreground">
                        Track messaging consent for all contacts
                      </p>
                    </div>
                    <Switch
                      checked={consentTracking}
                      onCheckedChange={setConsentTracking}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>TCPA Compliance Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Enforce TCPA regulations for all outbound messaging
                      </p>
                    </div>
                    <Switch
                      checked={tcpaMode}
                      onCheckedChange={setTcpaMode}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  Choose which alerts and reports you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Alert Types</h4>
                  {[
                    {
                      label: "New missed call",
                      desc: "Get notified when a call is missed",
                      checked: notifMissedCall,
                      onChange: setNotifMissedCall,
                    },
                    {
                      label: "Stale estimate alert",
                      desc: "When an estimate exceeds the stale threshold",
                      checked: notifStaleEstimate,
                      onChange: setNotifStaleEstimate,
                    },
                    {
                      label: "Campaign completed",
                      desc: "When a campaign finishes sending",
                      checked: notifCampaignComplete,
                      onChange: setNotifCampaignComplete,
                    },
                    {
                      label: "Booking confirmed",
                      desc: "When a new booking is created",
                      checked: notifBookingConfirmed,
                      onChange: setNotifBookingConfirmed,
                    },
                    {
                      label: "Daily digest",
                      desc: "Daily summary of key metrics",
                      checked: notifDailyDigest,
                      onChange: setNotifDailyDigest,
                    },
                    {
                      label: "Weekly report",
                      desc: "Weekly performance summary",
                      checked: notifWeeklyReport,
                      onChange: setNotifWeeklyReport,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <Label>{item.label}</Label>
                        <p className="text-xs text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                      <Switch
                        checked={item.checked}
                        onCheckedChange={item.onChange}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Delivery Channels</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={notifEmail}
                      onCheckedChange={setNotifEmail}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifSms}
                      onCheckedChange={setNotifSms}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Plan</CardTitle>
                  <CardDescription>
                    Your subscription and usage details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                    <div>
                      <h3 className="text-lg font-semibold">Growth Plan</h3>
                      <p className="text-2xl font-bold mt-1">
                        $299<span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </p>
                    </div>
                    <Badge variant="success" className="text-sm">
                      Active
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-3">
                      Usage This Month
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold">1,247</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          SMS Sent
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold">482</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Active Contacts
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Campaigns
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button disabled>Upgrade Plan</Button>
                    <Button variant="outline" disabled>
                      Manage Billing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to a new team member
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Name</Label>
              <Input
                id="invite-name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="csr">CSR</SelectItem>
                  <SelectItem value="readonly">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteUser}
              disabled={!inviteName.trim() || !inviteEmail.trim()}
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
