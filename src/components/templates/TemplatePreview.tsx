interface TemplatePreviewProps {
  body: string;
  type: "SMS" | "EMAIL";
  subject?: string;
}

function interpolate(text: string): string {
  return text
    .replace(/\{\{firstName\}\}/g, "Robert")
    .replace(/\{\{lastName\}\}/g, "Davis")
    .replace(/\{\{businessName\}\}/g, "Demo HVAC Pros")
    .replace(/\{\{businessPhone\}\}/g, "(555) 000-1234")
    .replace(/\{\{estimateTitle\}\}/g, "AC Unit Replacement")
    .replace(/\{\{estimateAmount\}\}/g, "4,200")
    .replace(/\{\{reviewLink\}\}/g, "g.page/r/demo")
    .replace(/\{\{[^}]+\}\}/g, "[variable]");
}

export function TemplatePreview({ body, type, subject }: TemplatePreviewProps) {
  const preview = interpolate(body);

  if (type === "SMS") {
    return (
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">SMS Preview</p>
        <div className="bg-slate-900 rounded-2xl p-4 max-w-xs">
          <div className="bg-green-500 text-white text-sm rounded-2xl rounded-tl-sm px-3 py-2">
            {preview}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Email Preview</p>
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {subject && (
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <span className="text-xs text-slate-500">Subject: </span>
            <span className="text-sm font-medium text-slate-900">{interpolate(subject)}</span>
          </div>
        )}
        <div className="p-4 text-sm text-slate-700 whitespace-pre-wrap">{preview}</div>
      </div>
    </div>
  );
}
