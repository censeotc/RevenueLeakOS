import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TemplateRecord } from "@/types/revenue";

export function TemplateEditor({ template }: { template: TemplateRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template editor</CardTitle>
        <CardDescription>Update subject lines, message body, and personalization variables.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input defaultValue={template.name} />
        {template.subject ? <Input defaultValue={template.subject} /> : null}
        <Textarea defaultValue={template.body} />
      </CardContent>
    </Card>
  );
}
