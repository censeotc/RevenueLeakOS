import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContactRecord } from "@/types/revenue";

export function ContactDetailPanel({ contact }: { contact: ContactRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{contact.name}</CardTitle>
        <CardDescription>{contact.email ?? 'No email on file'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p><span className="font-medium text-slate-900">Phone:</span> {contact.phone}</p>
        <p><span className="font-medium text-slate-900">Stage:</span> {contact.lifecycleStage}</p>
        <p><span className="font-medium text-slate-900">Last service:</span> {contact.lastServiceDate}</p>
      </CardContent>
    </Card>
  );
}
