import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { CallActionPanel } from "@/components/interactive";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCallsView } from "@/lib/demo-data";
import { requireRouteAccess } from "@/lib/guards";
import { formatDate } from "@/lib/utils";

export default async function CallsPage({ searchParams }: { searchParams?: Promise<{ tab?: string }> }) {
  await requireRouteAccess("/app/calls");
  const params = (await searchParams) ?? {};
  const tab = (["missed", "after_hours", "abandoned", "responded", "booked", "lost"] as const).includes((params.tab ?? "missed") as never)
    ? (params.tab as "missed" | "after_hours" | "abandoned" | "responded" | "booked" | "lost")
    : "missed";
  const data = getCallsView(tab);
  const selected = data.calls[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-500">Calls</p>
        <h1 className="text-3xl font-semibold tracking-tight">Missed and after-hours call recovery</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.tabs.map((item) => (
          <Link key={item} href={`/app/calls?tab=${item}`} className={`rounded-full px-4 py-2 text-sm font-medium ${tab === item ? "bg-zinc-950 text-white" : "bg-white text-zinc-600 border border-zinc-200"}`}>
            {item}
          </Link>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Call event table</CardTitle>
            <CardDescription>Linked opportunity, SMS preview, booking indicator, and disposition tab views.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.calls.length ? (
              data.calls.map((call) => (
                <div key={call.id} className="grid gap-3 rounded-xl border border-zinc-200 p-4 lg:grid-cols-[0.9fr_1fr_0.8fr_0.8fr] lg:items-center">
                  <div>
                    <p className="font-medium">{call.contact ? `${call.contact.firstName} ${call.contact.lastName}` : call.fromPhone}</p>
                    <p className="text-sm text-zinc-500">{call.summary}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{call.opportunity?.title ?? "No linked opportunity"}</p>
                    <p className="text-xs text-zinc-500">{call.smsPreview ?? "No thread yet"}</p>
                  </div>
                  <div>
                    <Badge variant={call.disposition === "booked" ? "success" : call.disposition === "lost" ? "danger" : call.disposition === "responded" ? "info" : "secondary"}>{call.disposition}</Badge>
                    <p className="mt-2 text-xs text-zinc-500">{formatDate(call.startedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{call.bookingLogged ? "Booked" : "Open"}</p>
                    <p className="text-xs text-zinc-500">{call.afterHours ? "After-hours" : "Business hours"}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title={`No ${tab.replace("_", " ")} calls`} description="Run the quick actions from the dashboard to create a seeded call event and SMS thread." actionLabel="Open dashboard" actionHref="/app/dashboard" />
            )}
          </CardContent>
        </Card>
        {selected ? (
          <Card>
            <CardHeader>
              <CardTitle>SMS thread preview</CardTitle>
              <CardDescription>Preview recent messages and move the call into booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {selected.messages.length ? (
                  selected.messages.map((message) => (
                    <div key={message.id} className={`rounded-xl p-3 text-sm ${message.direction === "outbound" ? "ml-10 bg-zinc-900 text-white" : "mr-10 bg-zinc-100 text-zinc-900"}`}>
                      <p>{message.body}</p>
                      <p className={`mt-1 text-xs ${message.direction === "outbound" ? "text-zinc-300" : "text-zinc-500"}`}>{formatDate(message.sentAt ?? message.receivedAt)}</p>
                    </div>
                  ))
                ) : (
                  <EmptyState title="No SMS thread yet" description="The selected call does not have any mock Twilio messages yet." />
                )}
              </div>
              <CallActionPanel opportunityId={selected.opportunityId} />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
