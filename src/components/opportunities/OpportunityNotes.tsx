import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OpportunityNote } from "@/types/revenue";

export function OpportunityNotes({ notes }: { notes: OpportunityNote[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Operator context and customer signal captured on the opportunity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.map((note) => (
          <div className="rounded-xl border border-slate-100 p-4" key={note.id}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="font-medium text-slate-900">{note.author}</p>
              <span className="text-slate-500">{note.createdAt}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{note.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
