"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type ContactRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  tags: string[];
  status: string;
  type: string;
  opportunities: Array<{ id: string; title: string; status: string }>;
  notes: Array<{ id: string; body: string; createdAt: string }>;
};

export function ContactsModule({ contacts }: { contacts: ContactRow[] }) {
  const [selectedId, setSelectedId] = useState(contacts[0]?.id ?? "");
  const [csvKind, setCsvKind] = useState<"contacts" | "estimates">("contacts");
  const [csvText, setCsvText] = useState(
    "first_name,last_name,phone,email\nAlex,Rivers,+13135550199,alex@example.com",
  );
  const [preview, setPreview] = useState<{
    headers: string[];
    mapping: Record<string, string>;
    errors: Array<{ row: number; message: string }>;
    totalRows: number;
    preview: Array<Record<string, string>>;
  } | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const selected = useMemo(
    () => contacts.find((contact) => contact.id === selectedId) ?? contacts[0],
    [contacts, selectedId],
  );

  async function runPreview() {
    setImportStatus(null);
    const response = await fetch("/api/import/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText, kind: csvKind }),
    });
    if (!response.ok) {
      setImportStatus("Could not preview CSV.");
      return;
    }
    setPreview(await response.json());
  }

  function runImport() {
    if (!preview) return;
    const errors = preview.errors.length;
    setImportStatus(
      errors
        ? `Imported with ${errors} row errors.`
        : `Import complete: ${preview.totalRows} rows processed successfully.`,
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className={contact.id === selected?.id ? "bg-slate-100" : undefined}
                  onClick={() => setSelectedId(contact.id)}
                >
                  <TableCell className="font-medium text-slate-900">{contact.fullName}</TableCell>
                  <TableCell>
                    <Badge>{contact.status}</Badge>
                  </TableCell>
                  <TableCell>{contact.type}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell className="space-x-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="info">
                        {tag}
                      </Badge>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{selected?.fullName ?? "Contact details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">{selected?.email}</p>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Linked opportunities</p>
              <div className="mt-2 space-y-2">
                {selected?.opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="rounded border border-slate-200 p-2">
                    <p className="text-sm font-medium text-slate-900">{opportunity.title}</p>
                    <p className="text-xs text-slate-500">{opportunity.status}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Recent notes</p>
              <div className="mt-2 space-y-2">
                {selected?.notes.map((note) => (
                  <div key={note.id} className="rounded border border-slate-200 p-2 text-xs text-slate-600">
                    {note.body}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV import scaffold</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={csvKind === "contacts" ? "default" : "outline"}
                onClick={() => setCsvKind("contacts")}
              >
                Contacts import
              </Button>
              <Button
                size="sm"
                variant={csvKind === "estimates" ? "default" : "outline"}
                onClick={() => setCsvKind("estimates")}
              >
                Estimates import
              </Button>
            </div>
            <p className="text-xs text-slate-600">
              Flow: upload → detect headers → map fields → validate rows → preview → import →
              success/errors.
            </p>
            <Textarea value={csvText} onChange={(event) => setCsvText(event.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" onClick={runPreview}>
                Run preview
              </Button>
              <Button size="sm" variant="outline" onClick={runImport}>
                Import
              </Button>
            </div>
            {preview ? (
              <div className="rounded border border-slate-200 bg-slate-50 p-2 text-xs">
                <p className="font-semibold text-slate-700">Detected headers</p>
                <p>{preview.headers.join(", ")}</p>
                <p className="mt-2 font-semibold text-slate-700">Field mapping</p>
                <pre>{JSON.stringify(preview.mapping, null, 2)}</pre>
                <p className="mt-2 font-semibold text-slate-700">
                  Validation: {preview.errors.length} errors
                </p>
              </div>
            ) : null}
            {importStatus ? <p className="text-xs text-slate-600">{importStatus}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
