import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactsView } from "@/lib/demo-data";

export default async function ContactsPage() {
  const contacts = getContactsView();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-medium text-zinc-500">Contacts</p>
          <h1 className="text-3xl font-semibold tracking-tight">Customer and prospect records</h1>
        </div>
        <Card>
          <CardHeader><CardTitle>CSV import scaffold</CardTitle><CardDescription>Drop-in point for historical contact or opportunity import.</CardDescription></CardHeader>
          <CardContent><div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">Import surface reserved for CSV mapping, duplicate resolution, and preview validation.</div></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Contact table</CardTitle><CardDescription>Tags, notes, and linked opportunities across the demo tenant.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="grid gap-4 rounded-xl border border-zinc-200 p-4 xl:grid-cols-[0.9fr_1fr_0.9fr] xl:items-center">
              <div><p className="font-medium">{contact.firstName} {contact.lastName}</p><p className="text-sm text-zinc-500">{contact.phone}</p></div>
              <div className="flex flex-wrap gap-2">{contact.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
              <div><p className="text-sm text-zinc-500">Linked opportunities</p><p className="text-sm font-medium">{contact.opportunities.length}</p><p className="mt-1 text-xs text-zinc-500 line-clamp-2">{contact.notes ?? "No notes yet."}</p></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
