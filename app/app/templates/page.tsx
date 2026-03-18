import { SectionHeader } from "@/components/section-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSessionUser } from "@/lib/session";
import { getTemplates } from "@/lib/services/revenueleak";
import { getBusinessProfile } from "@/lib/services/reportingService";
import {
  archiveTemplateAction,
  createTemplateAction,
  duplicateTemplateAction,
} from "@/app/actions";

const variableOptions = ["{{firstName}}", "{{businessName}}", "{{serviceType}}", "{{estimateNumber}}"];

export default async function TemplatesPage() {
  const user = await getSessionUser();
  const [templates, business] = await Promise.all([
    getTemplates(user.businessId),
    getBusinessProfile(user.businessId),
  ]);
  const businessName = business?.name ?? "Your Business";

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Templates"
        description="Manage outreach templates with variable picker, preview, duplicate, and archive controls."
      />

      <Card>
        <CardHeader>
          <CardTitle>Create / edit template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form action={createTemplateAction} className="space-y-3">
            <div className="grid gap-2 md:grid-cols-3">
              <Input name="name" placeholder="Template name" required />
              <Select name="type" defaultValue="sms">
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </Select>
              <Input name="subject" placeholder="Subject (email only)" />
            </div>
            <Textarea name="content" placeholder="Template body..." className="bg-white" required />
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-sm font-medium">Variable picker</p>
              <div className="flex flex-wrap gap-2">
                {variableOptions.map((variable) => (
                  <Badge key={variable} variant="secondary">
                    {variable}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Use the variables above inside your content. Preview uses sample values below.
              </p>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-900">Preview</p>
              <p className="mt-1 text-sm text-slate-600">
                Hi Mia, this is {businessName}. We can help with your Furnace
                Repair estimate EST-1204.
              </p>
            </div>
            <SubmitButton pendingLabel="Saving...">Save template</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{template.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{template.type}</Badge>
                  {template.isArchived ? <Badge variant="destructive">archived</Badge> : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {template.subject ? <p className="text-sm text-slate-600">Subject: {template.subject}</p> : null}
              <p className="rounded-md border border-slate-200 p-3 text-sm text-slate-700">
                {template.content}
              </p>
              <div className="flex flex-wrap gap-2">
                <form action={duplicateTemplateAction}>
                  <input type="hidden" name="templateId" value={template.id} />
                  <SubmitButton size="sm" variant="outline" pendingLabel="Duplicating...">
                    Duplicate
                  </SubmitButton>
                </form>
                {!template.isArchived ? (
                  <form action={archiveTemplateAction}>
                    <input type="hidden" name="templateId" value={template.id} />
                    <SubmitButton size="sm" variant="destructive" pendingLabel="Archiving...">
                      Archive
                    </SubmitButton>
                  </form>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
