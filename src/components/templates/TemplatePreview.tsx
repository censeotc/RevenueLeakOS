interface TemplatePreviewProps {
  channel: string;
  subject?: string;
  body: string;
}

export function TemplatePreview({ channel, subject, body }: TemplatePreviewProps) {
  const rendered = body
    .replace(/\{\{firstName\}\}/g, "Alice")
    .replace(/\{\{lastName\}\}/g, "Chen")
    .replace(/\{\{businessName\}\}/g, "Comfort Air HVAC")
    .replace(/\{\{businessPhone\}\}/g, "(555) 123-4567")
    .replace(/\{\{service\}\}/g, "AC replacement")
    .replace(/\{\{estimateNumber\}\}/g, "EST-1001")
    .replace(/\{\{estimateAmount\}\}/g, "$4,200")
    .replace(/\{\{equipmentType\}\}/g, "AC unit")
    .replace(/\{\{discountPercent\}\}/g, "15");

  return (
    <div className="rounded-lg border p-4">
      <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
        {channel} Preview
      </p>
      {channel === "email" && subject && (
        <p className="mb-2 font-medium">
          {subject
            .replace(/\{\{firstName\}\}/g, "Alice")
            .replace(/\{\{lastName\}\}/g, "Chen")}
        </p>
      )}
      <p className="whitespace-pre-wrap text-sm">{rendered}</p>
    </div>
  );
}
