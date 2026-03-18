"use client";

import { useState } from "react";
import { MessageSquare, Plus, Copy, Archive, Edit, Phone, FileText, RefreshCw, Star, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DEMO_TEMPLATES = [
  {
    id: "tpl-1",
    name: "Missed Call — Immediate Follow-Up",
    category: "missed_call",
    channel: "sms",
    body: "Hi {{firstName}}, we missed your call at {{businessName}}! We want to help — reply here or call us back at {{businessPhone}}. We're available {{businessHours}}.",
    variables: ["firstName", "businessName", "businessPhone", "businessHours"],
    useCount: 38,
    isArchived: false,
  },
  {
    id: "tpl-2",
    name: "Estimate Follow-Up — Day 3",
    category: "estimate_rescue",
    channel: "sms",
    body: "Hi {{firstName}}, just following up on your {{serviceType}} estimate for {{estimateAmount}}. Any questions? We're happy to walk you through it. — {{businessName}}",
    variables: ["firstName", "serviceType", "estimateAmount", "businessName"],
    useCount: 22,
    isArchived: false,
  },
  {
    id: "tpl-3",
    name: "Reactivation — Win-Back",
    category: "reactivation",
    channel: "sms",
    body: "Hi {{firstName}}! It's been a while since we serviced your {{serviceType}}. {{businessName}} is here when you need us — schedule your next tune-up or inspection anytime. Reply YES to get started!",
    variables: ["firstName", "serviceType", "businessName"],
    useCount: 15,
    isArchived: false,
  },
  {
    id: "tpl-4",
    name: "Booking Confirmation",
    category: "booking",
    channel: "sms",
    body: "Confirmed! Your appointment with {{businessName}} is scheduled for {{appointmentDate}} at {{appointmentTime}}. Our tech {{techName}} will arrive within the service window. Questions? Reply here.",
    variables: ["businessName", "appointmentDate", "appointmentTime", "techName"],
    useCount: 47,
    isArchived: false,
  },
  {
    id: "tpl-5",
    name: "Estimate Follow-Up — Day 7",
    category: "estimate_rescue",
    channel: "sms",
    body: "Hi {{firstName}}, still thinking about the {{serviceType}} estimate? We're holding your price through {{expiryDate}}. Give us a call or reply YES and we'll get it on the schedule. — {{businessName}}",
    variables: ["firstName", "serviceType", "expiryDate", "businessName"],
    useCount: 8,
    isArchived: false,
  },
  {
    id: "tpl-6",
    name: "Missed Call — Next Day",
    category: "missed_call",
    channel: "sms",
    body: "Hey {{firstName}}, still here! If you need HVAC, plumbing, or electrical help, {{businessName}} has you covered. Call us or reply to this message to get on the schedule.",
    variables: ["firstName", "businessName"],
    useCount: 19,
    isArchived: false,
  },
];

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  missed_call: { label: "Missed Call", icon: Phone, color: "bg-blue-100 text-blue-700" },
  estimate_rescue: { label: "Estimate Rescue", icon: FileText, color: "bg-purple-100 text-purple-700" },
  reactivation: { label: "Reactivation", icon: RefreshCw, color: "bg-green-100 text-green-700" },
  booking: { label: "Booking", icon: Star, color: "bg-orange-100 text-orange-700" },
};

function renderBody(body: string) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, v) => `<span class="bg-blue-50 text-blue-700 px-1 rounded font-mono text-xs">{{${v}}}</span>`);
}

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [preview, setPreview] = useState<(typeof DEMO_TEMPLATES)[0] | null>(null);

  const filtered = DEMO_TEMPLATES.filter((t) => {
    if (activeTab === "all") return true;
    return t.category === activeTab;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
          <p className="text-slate-500 text-sm mt-1">Reusable SMS and email message templates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({DEMO_TEMPLATES.length})</TabsTrigger>
          <TabsTrigger value="missed_call">Missed Call</TabsTrigger>
          <TabsTrigger value="estimate_rescue">Estimate Rescue</TabsTrigger>
          <TabsTrigger value="reactivation">Reactivation</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((template) => {
          const catCfg = CATEGORY_CONFIG[template.category] ?? { label: template.category, icon: MessageSquare, color: "bg-gray-100 text-gray-700" };
          const CatIcon = catCfg.icon;

          return (
            <Card key={template.id} className="hover:shadow-md transition">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", catCfg.color)}>
                      <CatIcon className="h-3 w-3" />
                      {catCfg.label}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">{template.channel}</span>
                  </div>
                  <span className="text-xs text-slate-400">{template.useCount} uses</span>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{template.name}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">{template.body}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.variables.map((v) => (
                    <span key={v} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-100">
                  <Button size="sm" variant="ghost" onClick={() => setPreview(template)}>
                    <Eye className="h-3 w-3" /> Preview
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Copy className="h-3 w-3" /> Duplicate
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 ml-auto">
                    <Archive className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent>
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle>{preview.name}</DialogTitle>
              </DialogHeader>
              <DialogBody className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Preview with sample data</p>
                  <div className="bg-slate-900 rounded-2xl p-4">
                    <div className="bg-blue-500 text-white text-sm rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] inline-block">
                      {preview.body
                        .replace("{{firstName}}", "Robert")
                        .replace("{{businessName}}", "North Shore Heating & Plumbing")
                        .replace("{{businessPhone}}", "(734) 555-0100")
                        .replace("{{businessHours}}", "Mon–Fri 7am–6pm")
                        .replace("{{serviceType}}", "AC Tune-Up")
                        .replace("{{estimateAmount}}", "$4,800")
                        .replace("{{appointmentDate}}", "Thursday, June 12")
                        .replace("{{appointmentTime}}", "10:00 AM")
                        .replace("{{techName}}", "Mike T.")
                        .replace("{{expiryDate}}", "June 15")
                      }
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Variables used</p>
                  <div className="flex flex-wrap gap-1.5">
                    {preview.variables.map((v) => (
                      <span key={v} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono">
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPreview(null)}>Close</Button>
                <Button>Use Template</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
