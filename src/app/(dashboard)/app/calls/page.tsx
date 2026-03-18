import { CallDetailPanel } from "@/components/calls/CallDetailPanel";
import { CallsTable } from "@/components/calls/CallsTable";
import { CallsTabs } from "@/components/calls/CallsTabs";
import { SmsThreadPreview } from "@/components/calls/SmsThreadPreview";
import { PageHeading } from "@/components/shared/PageHeading";
import { calls } from "@/data/demoData";

export default function CallsPage() {
  const selectedCall = calls[0];
  return (
    <div className="space-y-6">
      <PageHeading eyebrow="Calls" title="Review missed calls and message follow-up" description="Keep after-hours leads from going dark by pairing call events with immediate response workflows." />
      <CallsTabs />
      <CallsTable calls={calls} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <CallDetailPanel call={selectedCall} />
        <SmsThreadPreview messages={selectedCall.thread} />
      </div>
    </div>
  );
}
