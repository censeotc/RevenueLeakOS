export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Import CSV
        </button>
      </div>

      {/* ContactsTable */}
      {/* ContactDetailPanel (slide-over) */}
      {/* CsvImportWizard (modal) */}
    </div>
  );
}
