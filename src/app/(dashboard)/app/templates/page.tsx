import { PageHeading } from "@/components/shared/PageHeading";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { TemplateTable } from "@/components/templates/TemplateTable";
import { VariablePicker } from "@/components/templates/VariablePicker";
import { templates } from "@/data/demoData";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Templates" title="Author reusable messaging for every workflow" description="Keep follow-up consistent while still supporting personalization and channel-specific previews." />
      <TemplateTable templates={templates} />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <TemplateEditor template={templates[0]} />
        <TemplatePreview template={templates[0]} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <h2 className="text-lg font-semibold text-slate-950">Variables</h2>
        <p className="mt-1 text-sm text-slate-600">Available merge fields for the selected template.</p>
        <div className="mt-4"><VariablePicker variables={templates[0].variables} /></div>
      </div>
    </div>
  );
}
