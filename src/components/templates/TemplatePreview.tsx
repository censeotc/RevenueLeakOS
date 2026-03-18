import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TemplateRecord } from "@/types/revenue";

export function TemplatePreview({ template }: { template: TemplateRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>{template.channel.toUpperCase()} rendering for the selected template.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        {template.subject ? <p><span className="font-medium text-slate-900">Subject:</span> {template.subject}</p> : null}
        <div className="rounded-xl border border-slate-100 p-4 text-slate-700">{template.body}</div>
      </CardContent>
    </Card>
  );
}
