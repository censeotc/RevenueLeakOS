import Link from "next/link";

import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { CsvImportScaffold } from "@/components/import/csv-import-scaffold";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContacts, getOpportunities } from "@/lib/data/selectors";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const contacts = getContacts();
  const selected = contacts.find((contact) => contact.id === params.id) ?? contacts[0];
  const linkedOpportunities = getOpportunities().filter(
    (opportunity) => opportunity.contactId === selected.id,
  );

  return (
    <>
      <PageHeader
        eyebrow="Customer records"
        title="Contacts"
        description="Review homeowner records, tags, notes, and linked opportunities while keeping import tools ready for CSV onboarding."
      />

      <section className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Contacts table</CardTitle>
            <CardDescription>Leads, customers, and former customers in the demo tenant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/app/contacts?id=${contact.id}`}
                className="grid gap-3 rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50 md:grid-cols-[1fr,0.8fr,0.9fr,0.8fr]"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{contact.phone}</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-500">Type</p>
                  <p className="font-medium text-slate-900">{contact.type.replace(/_/g, " ")}</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-500">Tags</p>
                  <p className="font-medium text-slate-900">{contact.tags.join(", ")}</p>
                </div>
                <div className="flex items-start justify-end">
                  <StatusBadge value={contact.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact detail</CardTitle>
              <CardDescription>
                {selected.firstName} {selected.lastName} · {selected.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">Notes</p>
                <p className="mt-2 text-sm text-slate-600">{selected.notesSummary}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Last contacted {selected.lastContactedAt ? formatRelativeTime(selected.lastContactedAt) : "n/a"}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">Linked opportunities</p>
                {linkedOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{opportunity.title}</p>
                        <p className="text-sm text-slate-500">{opportunity.serviceType}</p>
                      </div>
                      <StatusBadge value={opportunity.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <CsvImportScaffold mode="contacts" />
        </div>
      </section>
    </>
  );
}
