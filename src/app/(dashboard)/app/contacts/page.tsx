import { ContactDetailPanel } from "@/components/contacts/ContactDetailPanel";
import { ContactTags } from "@/components/contacts/ContactTags";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { CsvImportWizard } from "@/components/contacts/CsvImportWizard";
import { PageHeading } from "@/components/shared/PageHeading";
import { contacts } from "@/data/demoData";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Contacts" title="Manage the people behind every opportunity" description="Inspect lifecycle stage, tags, import quality, and recent revenue value from one place." />
      <CsvImportWizard />
      <ContactsTable contacts={contacts} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ContactDetailPanel contact={contacts[0]} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
          <h2 className="text-lg font-semibold text-slate-950">Tags</h2>
          <p className="mt-1 text-sm text-slate-600">Segment and route the selected contact with domain-specific labels.</p>
          <div className="mt-4"><ContactTags tags={contacts[0].tags} /></div>
        </div>
      </div>
    </div>
  );
}
