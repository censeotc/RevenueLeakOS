"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignTypes, templateEditorSchema } from "@/lib/domain/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type TemplateRow = {
  id: string;
  name: string;
  type: string;
  channel: "sms" | "email";
  body: string;
  isArchived: boolean;
};

type FormValues = z.infer<typeof templateEditorSchema>;

const variableOptions = ["{{firstName}}", "{{serviceType}}", "{{estimateId}}", "{{bookingLink}}"];

export function TemplatesModule({ templates }: { templates: TemplateRow[] }) {
  const [tab, setTab] = useState<"all" | (typeof campaignTypes)[number]>("all");
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(templateEditorSchema),
    defaultValues: {
      name: "Day 1 missed-call follow-up",
      type: "missed_call_followup",
      channel: "sms",
      body: "Hi {{firstName}}, we can still help with {{serviceType}} today. Reply YES to book.",
    },
  });

  const filtered = useMemo(
    () => templates.filter((template) => (tab === "all" ? true : template.type === tab)),
    [templates, tab],
  );

  async function saveTemplate(values: FormValues) {
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setMessage(response.ok ? "Template saved as draft." : "Could not save template.");
  }

  async function duplicateTemplate(id: string) {
    const response = await fetch(`/api/templates/${id}/duplicate`, { method: "POST" });
    setMessage(response.ok ? "Template duplicated." : "Could not duplicate template.");
  }

  async function archiveTemplate(id: string) {
    const response = await fetch(`/api/templates/${id}/archive`, { method: "PATCH" });
    setMessage(response.ok ? "Template archived." : "Could not archive template.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="missed_call_followup">Missed Call</TabsTrigger>
              <TabsTrigger value="estimate_rescue">Estimate Rescue</TabsTrigger>
              <TabsTrigger value="reactivation">Reactivation</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <p className="font-medium text-slate-900">{template.name}</p>
                    {template.isArchived ? <Badge variant="warning">Archived</Badge> : null}
                  </TableCell>
                  <TableCell>{template.type}</TableCell>
                  <TableCell>{template.channel}</TableCell>
                  <TableCell className="max-w-sm text-xs text-slate-600">
                    {template.body.slice(0, 100)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => duplicateTemplate(template.id)}>
                        Duplicate
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => archiveTemplate(template.id)}>
                        Archive
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Template editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={form.handleSubmit(saveTemplate)} className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select {...form.register("type")}>
                  {campaignTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select {...form.register("channel")}>
                  <option value="sms">sms</option>
                  <option value="email">email</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Variable picker</Label>
              <div className="flex flex-wrap gap-2">
                {variableOptions.map((variable) => (
                  <Button
                    key={variable}
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() =>
                      form.setValue("body", `${form.getValues("body")} ${variable}`.trim())
                    }
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea {...form.register("body")} />
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Preview</p>
              {form
                .watch("body")
                .replace("{{firstName}}", "Mia")
                .replace("{{serviceType}}", "furnace repair")
                .replace("{{estimateId}}", "EST-2031")
                .replace("{{bookingLink}}", "northshore.demo/book")}
            </div>
            <Button type="submit">Save template</Button>
          </form>
          {message ? <p className="text-xs text-slate-600">{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
