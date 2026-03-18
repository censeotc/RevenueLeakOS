"use client";

import { useState, useMemo, useRef } from "react";
import {
  Plus,
  Copy,
  Archive,
  Pencil,
  MessageSquare,
  Mail,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

import { DEMO_TEMPLATES } from "@/lib/demo-data";
import type { DemoTemplate } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type CategoryTab = "all" | "missed_call" | "estimate_rescue" | "reactivation" | "booking";

const CATEGORY_LABELS: Record<string, string> = {
  missed_call: "Missed Call",
  estimate_rescue: "Estimate Rescue",
  reactivation: "Reactivation",
  booking: "Booking",
};

const VARIABLES = [
  "firstName",
  "lastName",
  "businessName",
  "phone",
  "estimateAmount",
  "serviceType",
  "bookingDate",
] as const;

const SAMPLE_VALUES: Record<string, string> = {
  firstName: "John",
  lastName: "Smith",
  businessName: "North Shore Heating & Plumbing",
  phone: "(248) 555-1000",
  estimateAmount: "$2,500",
  serviceType: "Furnace Repair",
  bookingDate: "March 25, 2026",
  appointmentDate: "March 25, 2026",
  appointmentTime: "10:00 AM",
  lastServiceDate: "January 15, 2026",
  discountAmount: "$50",
};

function replaceVariables(text: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => SAMPLE_VALUES[key] ?? `{{${key}}}`);
}

function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.slice(2, -2))));
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<DemoTemplate[]>([...DEMO_TEMPLATES]);
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DemoTemplate | null>(null);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("missed_call");
  const [formChannel, setFormChannel] = useState<"sms" | "email">("sms");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");

  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const counts = useMemo(() => {
    const all = templates.length;
    const missed_call = templates.filter((t) => t.category === "missed_call").length;
    const estimate_rescue = templates.filter((t) => t.category === "estimate_rescue").length;
    const reactivation = templates.filter((t) => t.category === "reactivation").length;
    const booking = templates.filter((t) => t.category === "booking").length;
    return { all, missed_call, estimate_rescue, reactivation, booking };
  }, [templates]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return templates;
    return templates.filter((t) => t.category === activeTab);
  }, [activeTab, templates]);

  function openCreateDialog() {
    setEditingTemplate(null);
    setFormName("");
    setFormCategory("missed_call");
    setFormChannel("sms");
    setFormSubject("");
    setFormBody("");
    setDialogOpen(true);
  }

  function openEditDialog(template: DemoTemplate) {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormCategory(template.category);
    setFormChannel(template.channel as "sms" | "email");
    setFormSubject(template.subject ?? "");
    setFormBody(template.body);
    setDialogOpen(true);
  }

  function handleSave() {
    const now = new Date();
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                name: formName,
                category: formCategory,
                channel: formChannel as DemoTemplate["channel"],
                subject: formChannel === "email" ? formSubject : null,
                body: formBody,
                variables: extractVariables(formBody),
                updatedAt: now,
              }
            : t
        )
      );
    } else {
      const newTemplate: DemoTemplate = {
        id: `tpl_${Date.now()}`,
        businessId: "biz_1",
        name: formName,
        category: formCategory,
        channel: formChannel as DemoTemplate["channel"],
        subject: formChannel === "email" ? formSubject : null,
        body: formBody,
        variables: extractVariables(formBody),
        isArchived: false,
        createdAt: now,
        updatedAt: now,
      };
      setTemplates((prev) => [newTemplate, ...prev]);
    }
    setDialogOpen(false);
  }

  function handleDuplicate(template: DemoTemplate) {
    const now = new Date();
    const copy: DemoTemplate = {
      ...template,
      id: `tpl_${Date.now()}`,
      name: `Copy of ${template.name}`,
      createdAt: now,
      updatedAt: now,
    };
    setTemplates((prev) => [copy, ...prev]);
  }

  function handleArchiveToggle(template: DemoTemplate) {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === template.id
          ? { ...t, isArchived: !t.isArchived, updatedAt: new Date() }
          : t
      )
    );
  }

  function insertVariable(variable: string) {
    const tag = `{{${variable}}}`;
    const textarea = bodyRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody = formBody.slice(0, start) + tag + formBody.slice(end);
      setFormBody(newBody);
      requestAnimationFrame(() => {
        textarea.focus();
        const pos = start + tag.length;
        textarea.setSelectionRange(pos, pos);
      });
    } else {
      setFormBody((prev) => prev + tag);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Message templates for automated outreach"
      >
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CategoryTab)}>
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="missed_call">Missed Call ({counts.missed_call})</TabsTrigger>
          <TabsTrigger value="estimate_rescue">Estimate Rescue ({counts.estimate_rescue})</TabsTrigger>
          <TabsTrigger value="reactivation">Reactivation ({counts.reactivation})</TabsTrigger>
          <TabsTrigger value="booking">Booking ({counts.booking})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "relative transition-opacity",
                  template.isArchived && "opacity-50"
                )}
              >
                {template.isArchived && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-muted/40">
                    <Badge variant="secondary" className="text-xs">Archived</Badge>
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" className="text-xs font-normal">
                        {CATEGORY_LABELS[template.category] ?? template.category}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs border-0",
                          template.channel === "sms"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        )}
                      >
                        {template.channel === "sms" ? (
                          <MessageSquare className="mr-1 h-3 w-3" />
                        ) : (
                          <Mail className="mr-1 h-3 w-3" />
                        )}
                        {template.channel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.body.length > 120
                      ? template.body.slice(0, 120) + "..."
                      : template.body}
                  </p>

                  {template.variables.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((v) => (
                        <span
                          key={v}
                          className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                        >
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 pt-1 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => openEditDialog(template)}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleDuplicate(template)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Duplicate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleArchiveToggle(template)}
                    >
                      <Archive className="mr-1 h-3 w-3" />
                      {template.isArchived ? "Restore" : "Archive"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No templates found in this category.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Modify the template details below."
                : "Configure a new message template for automated outreach."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tpl-name">Name</Label>
              <Input
                id="tpl-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Template name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missed_call">Missed Call</SelectItem>
                    <SelectItem value="estimate_rescue">Estimate Rescue</SelectItem>
                    <SelectItem value="reactivation">Reactivation</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select
                  value={formChannel}
                  onValueChange={(v) => setFormChannel(v as "sms" | "email")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formChannel === "email" && (
              <div className="space-y-2">
                <Label htmlFor="tpl-subject">Subject</Label>
                <Input
                  id="tpl-subject"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Email subject line"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tpl-body">Body</Label>
              <Textarea
                id="tpl-body"
                ref={bodyRef}
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Insert Variable
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {VARIABLES.map((v) => (
                  <Button
                    key={v}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-mono"
                    onClick={() => insertVariable(v)}
                  >
                    {`{{${v}}}`}
                  </Button>
                ))}
              </div>
            </div>

            {formBody && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Preview</Label>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                  {formChannel === "email" && formSubject && (
                    <p className="font-semibold mb-2">
                      Subject: {replaceVariables(formSubject)}
                    </p>
                  )}
                  {replaceVariables(formBody)}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName.trim() || !formBody.trim()}>
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
