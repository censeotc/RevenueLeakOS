"use client";

import { useState } from "react";
import { Users, Search, Plus, Upload, Tag, Phone, Mail, ChevronRight, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, formatPhone, getInitials, cn } from "@/lib/utils";
import { subDays } from "date-fns";

interface DemoContact { id: string; firstName: string; lastName: string; phone: string; email: string; type: string; status: string; city: string; totalSpend: number; lastServiceAt: Date | null; tags: string[]; opportunities: number; }
const DEMO_CONTACTS: DemoContact[] = [
  { id: "c1", firstName: "Robert", lastName: "Caldwell", phone: "(734) 555-1001", email: "r.caldwell@email.com", type: "customer", status: "active", city: "Grosse Pointe", totalSpend: 4200, lastServiceAt: subDays(new Date(), 45), tags: [], opportunities: 1 },
  { id: "c2", firstName: "Linda", lastName: "Morrison", phone: "(734) 555-1002", email: "linda.m@email.com", type: "customer", status: "dormant", city: "Harper Woods", totalSpend: 8750, lastServiceAt: subDays(new Date(), 420), tags: ["high-value"], opportunities: 2 },
  { id: "c3", firstName: "Tom", lastName: "Bancroft", phone: "(313) 555-1003", email: "tbancroft@email.com", type: "customer", status: "dormant", city: "St. Clair Shores", totalSpend: 3100, lastServiceAt: subDays(new Date(), 380), tags: [], opportunities: 1 },
  { id: "c4", firstName: "Jennifer", lastName: "Walsh", phone: "(313) 555-1004", email: "jwalsh@email.com", type: "customer", status: "active", city: "Grosse Pointe", totalSpend: 6400, lastServiceAt: subDays(new Date(), 60), tags: [], opportunities: 0 },
  { id: "c5", firstName: "David", lastName: "Kim", phone: "(248) 555-1005", email: "dkim@email.com", type: "lead", status: "active", city: "Birmingham", totalSpend: 0, lastServiceAt: null, tags: [], opportunities: 1 },
  { id: "c6", firstName: "Patricia", lastName: "Nguyen", phone: "(248) 555-1006", email: "p.nguyen@email.com", type: "customer", status: "dormant", city: "Royal Oak", totalSpend: 2900, lastServiceAt: subDays(new Date(), 500), tags: [], opportunities: 1 },
  { id: "c7", firstName: "Kevin", lastName: "Stern", phone: "(586) 555-1007", email: "kstern@email.com", type: "customer", status: "active", city: "Macomb", totalSpend: 11200, lastServiceAt: subDays(new Date(), 30), tags: ["high-value"], opportunities: 1 },
  { id: "c8", firstName: "Nancy", lastName: "Ostrowski", phone: "(586) 555-1008", email: "n.ostrowski@email.com", type: "customer", status: "dormant", city: "Warren", totalSpend: 5600, lastServiceAt: subDays(new Date(), 460), tags: [], opportunities: 1 },
  { id: "c9", firstName: "Chris", lastName: "Delgado", phone: "(734) 555-1009", email: "c.delgado@email.com", type: "lead", status: "active", city: "Ann Arbor", totalSpend: 0, lastServiceAt: null, tags: [], opportunities: 1 },
  { id: "c10", firstName: "Angela", lastName: "Foster", phone: "(734) 555-1010", email: "a.foster@email.com", type: "customer", status: "active", city: "Ypsilanti", totalSpend: 3800, lastServiceAt: subDays(new Date(), 90), tags: [], opportunities: 0 },
  { id: "c11", firstName: "Mark", lastName: "Reynolds", phone: "(313) 555-1011", email: "m.reynolds@email.com", type: "customer", status: "active", city: "Detroit", totalSpend: 9300, lastServiceAt: subDays(new Date(), 15), tags: ["high-value"], opportunities: 0 },
  { id: "c12", firstName: "Paul", lastName: "Thornton", phone: "(248) 555-1013", email: "p.thornton@email.com", type: "customer", status: "dormant", city: "Troy", totalSpend: 7100, lastServiceAt: subDays(new Date(), 395), tags: ["high-value"], opportunities: 1 },
  { id: "c13", firstName: "Sandra", lastName: "Mitchell", phone: "(248) 555-1014", email: "s.mitchell@email.com", type: "customer", status: "active", city: "Bloomfield Hills", totalSpend: 4500, lastServiceAt: subDays(new Date(), 20), tags: [], opportunities: 0 },
  { id: "c14", firstName: "Gary", lastName: "Larson", phone: "(586) 555-1015", email: "g.larson@email.com", type: "lead", status: "active", city: "Sterling Heights", totalSpend: 0, lastServiceAt: null, tags: [], opportunities: 1 },
  { id: "c15", firstName: "Eric", lastName: "Zimmerman", phone: "(248) 555-1021", email: "e.zimmerman@email.com", type: "customer", status: "active", city: "West Bloomfield", totalSpend: 8900, lastServiceAt: subDays(new Date(), 35), tags: ["high-value"], opportunities: 1 },
];

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  dormant: "bg-orange-100 text-orange-700",
  archived: "bg-gray-100 text-gray-600",
};

const TYPE_COLORS = {
  customer: "bg-blue-100 text-blue-700",
  lead: "bg-purple-100 text-purple-700",
  former_customer: "bg-gray-100 text-gray-700",
};

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<(typeof DEMO_CONTACTS)[0] | null>(null);

  const filtered = DEMO_CONTACTS.filter((c) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "customers" && c.type === "customer") ||
      (activeTab === "leads" && c.type === "lead") ||
      (activeTab === "dormant" && c.status === "dormant");
    const matchesSearch =
      !search ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 text-sm mt-1">{DEMO_CONTACTS.length} total contacts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: DEMO_CONTACTS.length },
          { label: "Customers", value: DEMO_CONTACTS.filter(c => c.type === "customer").length },
          { label: "Leads", value: DEMO_CONTACTS.filter(c => c.type === "lead").length },
          { label: "Dormant", value: DEMO_CONTACTS.filter(c => c.status === "dormant").length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="dormant">Dormant</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Location</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Last Service</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Total Spend</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Opps</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition" onClick={() => setSelected(contact)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-slate-600">
                          {getInitials(`${contact.firstName} ${contact.lastName}`)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{contact.firstName} {contact.lastName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-400">{formatPhone(contact.phone)}</p>
                          {contact.tags.includes("high-value") && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0 rounded">High Value</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", TYPE_COLORS[contact.type as keyof typeof TYPE_COLORS] ?? "bg-gray-100 text-gray-700")}>
                      {contact.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", STATUS_COLORS[contact.status as keyof typeof STATUS_COLORS] ?? "bg-gray-100 text-gray-700")}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{contact.city}</span>
                  </td>
                  <td className="px-4 py-3">
                    {contact.lastServiceAt ? (
                      <span className="text-sm text-slate-600">{formatDate(contact.lastServiceAt)}</span>
                    ) : (
                      <span className="text-xs text-slate-400">Never</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-800">
                      {contact.totalSpend > 0 ? formatCurrency(contact.totalSpend) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{contact.opportunities}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
