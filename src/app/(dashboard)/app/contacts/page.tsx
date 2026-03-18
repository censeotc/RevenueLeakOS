import type { Metadata } from "next";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { CsvImportWizard } from "@/components/contacts/CsvImportWizard";

export const metadata: Metadata = { title: "Contacts" };

export default function ContactsPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your customer database</p>
        </div>
        <div className="flex items-center gap-2">
          <CsvImportWizard />
          <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Contact
          </button>
        </div>
      </div>
      <ContactsTable />
    </div>
  );
}
