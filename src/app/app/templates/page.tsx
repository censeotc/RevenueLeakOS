import { TemplateActions } from "@/components/interactive";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTemplatesView } from "@/lib/demo-data";

export default async function TemplatesPage() {
  const templates = getTemplatesView();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Templates</p>
        <h1 className="text-3xl font-semibold tracking-tight">Messaging templates and preview editor</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div><CardTitle>{template.name}</CardTitle><CardDescription>{template.channel}</CardDescription></div>
                <Badge variant={template.status === "active" ? "success" : template.status === "archived" ? "danger" : "secondary"}>{template.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">Variable picker</p>
                <div className="flex flex-wrap gap-2">{template.variables.map((variable) => <Badge key={variable} variant="info">{`{{${variable}}}`}</Badge>)}</div>
              </div>
              <div className="rounded-xl bg-zinc-100 p-4 text-sm text-zinc-600">{template.subject ? <p className="mb-2 font-medium text-zinc-900">{template.subject}</p> : null}<p>{template.body}</p></div>
              <TemplateActions templateId={template.id} archived={template.status === "archived"} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
