import type { Metadata } from "next";
import { CallsTabs } from "@/components/calls/CallsTabs";

export const metadata: Metadata = { title: "Calls & SMS" };

export default function CallsPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calls & SMS</h1>
        <p className="text-slate-500 text-sm mt-0.5">Inbound calls, outbound campaigns, and SMS threads</p>
      </div>
      <CallsTabs />
    </div>
  );
}
