export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage SMS and email templates for your campaigns</p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          New Template
        </button>
      </div>

      {/* TemplateTable */}
      {/* TemplateEditor + VariablePicker (modal) */}
      {/* TemplatePreview */}
    </div>
  );
}
