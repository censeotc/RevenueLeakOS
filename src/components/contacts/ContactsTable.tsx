import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency } from "@/lib/formatters";
import type { ContactRecord } from "@/types/revenue";

export function ContactsTable({ contacts }: { contacts: ContactRecord[] }) {
  return (
    <DataTable
      title="Contacts"
      description="Imported people and households tied to recovery workflows."
      columns={["Name", "Lifecycle", "Phone", "Recent value"]}
      rows={contacts.map((contact) => [contact.name, contact.lifecycleStage, contact.phone, formatCurrency(contact.lastOpportunityValueCents)])}
    />
  );
}
