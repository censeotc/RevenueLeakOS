"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { demoTemplates } from "@/services/seededDataService";
import {
  Mail,
  MessageSquare,
  Plus,
  Copy,
  Archive,
  Eye,
  Edit,
  X,
  Variable,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function TemplatesPage() {
  const { pushToast } = useToast();
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");

  const filtered = typeFilter
    ? demoTemplates.filter((t) => t.type === typeFilter)
    : demoTemplates;

  const selected = selectedTemplate ? demoTemplates.find((t) => t.id === selectedTemplate) : null;

  const sampleVariables: Record<string, string> = {
    firstName: "Robert",
    businessName: "North Shore Heating & Plumbing",
    businessPhone: "(313) 555-0100",
    serviceType: "Furnace Repair",
    estimateDate: "March 5, 2026",
    estimateAmount: "$3,200",
    appointmentDate: "March 20, 2026",
    appointmentTime: "2:00 PM",
    monthsSinceService: "14",
  };

  const renderPreview = (body: string) => {
    let rendered = body;
    Object.entries(sampleVariables).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    });
    return rendered;
  };

  const handleSelect = (id: string) => {
    setSelectedTemplate(id);
    const t = demoTemplates.find((t) => t.id === id);
    if (t) {
      setEditBody(t.body);
      setEditSubject(t.subject || "");
      setPreviewMode(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selected ? "hidden lg:flex" : ""}`}>
        <TopBar title="Templates" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant={!typeFilter ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(null)}>
                All ({demoTemplates.length})
              </Button>
              <Button variant={typeFilter === "sms" ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("sms")}>
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                SMS ({demoTemplates.filter((t) => t.type === "sms").length})
              </Button>
              <Button variant={typeFilter === "email" ? "default" : "outline"} size="sm" onClick={() => setTypeFilter("email")}>
                <Mail className="h-3.5 w-3.5 mr-1" />
                Email ({demoTemplates.filter((t) => t.type === "email").length})
              </Button>
            </div>
            <Button
              size="sm"
              onClick={() =>
                pushToast({
                  title: "Template scaffold ready",
                  description: "New template creation will be enabled in a follow-up write flow.",
                  variant: "info",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelect(template.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {template.type === "sms" ? (
                        <div className="rounded-lg p-2 bg-green-50">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="rounded-lg p-2 bg-blue-50">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-semibold">{template.name}</h3>
                        <span className="text-xs text-muted-foreground uppercase">{template.type}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-accent text-muted-foreground" title="Duplicate">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-accent text-muted-foreground" title="Archive">
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {template.subject && (
                    <p className="text-xs font-medium mt-3 text-foreground">Subject: {template.subject}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{template.body}</p>
                  <div className="flex gap-1 flex-wrap mt-3">
                    {template.variables.map((v) => (
                      <span key={v} className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <EmptyState
                title="No templates in this filter"
                description="Switch channel filters or create a new draft template."
              />
            )}
          </div>
        </div>
      </div>

      {/* Template Editor */}
      {selected && (
        <div className="w-full lg:w-[520px] border-l border-border bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              {selected.type === "sms" ? (
                <MessageSquare className="h-5 w-5 text-green-600" />
              ) : (
                <Mail className="h-5 w-5 text-blue-600" />
              )}
              <h2 className="font-semibold">{selected.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <button onClick={() => setSelectedTemplate(null)} className="rounded-lg p-1 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {previewMode ? (
              <div>
                <h3 className="text-sm font-medium mb-2">Preview (with sample data)</h3>
                {selected.subject && (
                  <div className="p-3 bg-muted/50 rounded-lg mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Subject</p>
                    <p className="text-sm font-medium">{renderPreview(selected.subject)}</p>
                  </div>
                )}
                <div className={`rounded-lg p-4 text-sm whitespace-pre-wrap ${
                  selected.type === "sms"
                    ? "bg-green-50 border border-green-200"
                    : "bg-blue-50 border border-blue-200"
                }`}>
                  {renderPreview(editBody || selected.body)}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Template Name</label>
                  <input
                    className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background"
                    defaultValue={selected.name}
                  />
                </div>
                {selected.type === "email" && (
                  <div>
                    <label className="text-sm font-medium block mb-1">Subject</label>
                    <input
                      className="w-full h-9 rounded-lg border border-input px-3 text-sm bg-background"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium block mb-1">Body</label>
                  <textarea
                    className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-background min-h-[200px] font-mono"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                </div>

                {/* Variable Picker */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Variable className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Variables</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {Object.keys(sampleVariables).map((v) => (
                      <button
                        key={v}
                        className="inline-flex items-center rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                        onClick={() => setEditBody((prev) => prev + `{{${v}}}`)}
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() =>
                  pushToast({
                    title: "Template saved",
                    description: "Template updates were applied in demo mode.",
                    variant: "success",
                  })
                }
              >
                Save Template
              </Button>
              <Button variant="outline" size="icon" title="Duplicate">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Archive">
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
