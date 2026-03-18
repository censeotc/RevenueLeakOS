import Link from "next/link";
import { CallDisposition } from "@prisma/client";
import { SectionHeader } from "@/components/section-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUser } from "@/lib/session";
import { getCallEvents } from "@/lib/services/revenueleak";
import { logBookingAction, simulateMissedCallAction, simulateReplyAction } from "@/app/actions";

const tabs: Array<{ value: "all" | CallDisposition; label: string }> = [
  { value: "all", label: "All" },
  { value: "missed", label: "Missed" },
  { value: "after_hours", label: "After-hours" },
  { value: "abandoned", label: "Abandoned" },
  { value: "responded", label: "Responded" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
];

type SearchParams = { tab?: "all" | CallDisposition };

export default async function CallsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getSessionUser();
  const params = await searchParams;
  const tab = params.tab ?? "all";
  const rows = await getCallEvents(user.businessId, tab);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Calls"
        description="Missed-call capture and response tracking with linked opportunity context."
      />

      <Card>
        <CardHeader>
          <CardTitle>Mock missed-call workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={simulateMissedCallAction} className="grid gap-2 md:grid-cols-4">
            <Input name="contactName" placeholder="Contact name" defaultValue="Jordan Flynn" />
            <Input name="fromNumber" placeholder="From number" defaultValue="+12485559701" />
            <Input name="toNumber" placeholder="Business line" defaultValue="+12485550111" />
            <SubmitButton pendingLabel="Running...">Simulate inbound missed call</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <Link
            key={item.value}
            href={`/app/calls?tab=${item.value}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === item.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Call event table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disposition</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Linked opportunity</TableHead>
                <TableHead>SMS thread preview</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Badge variant={row.disposition === "booked" ? "success" : "outline"}>
                      {row.disposition.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.contact
                      ? `${row.contact.firstName} ${row.contact.lastName}`
                      : row.fromNumber}
                  </TableCell>
                  <TableCell>
                    {row.opportunity ? (
                      <Link
                        href={`/app/opportunities?selected=${row.opportunity.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {row.opportunity.title}
                      </Link>
                    ) : (
                      <span className="text-slate-500">No linked opportunity</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.opportunity?.messageEvents?.length ? (
                      <div className="space-y-1">
                        {row.opportunity.messageEvents.map((m) => (
                          <p key={m.id} className="max-w-xs truncate text-xs text-slate-600">
                            <span className="font-semibold">{m.direction}:</span> {m.body}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">No SMS events yet.</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.booking ? (
                      <Badge variant="success">Booked</Badge>
                    ) : (
                      <Badge variant="secondary">Open</Badge>
                    )}
                  </TableCell>
                  <TableCell className="space-y-2">
                    {row.opportunity ? (
                      <>
                        <form action={simulateReplyAction}>
                          <input type="hidden" name="opportunityId" value={row.opportunity.id} />
                          <input type="hidden" name="body" value="Yes, please send me availability." />
                          <SubmitButton size="sm" variant="outline" pendingLabel="Replying...">
                            Simulate reply
                          </SubmitButton>
                        </form>
                        <form action={logBookingAction}>
                          <input type="hidden" name="opportunityId" value={row.opportunity.id} />
                          <input type="hidden" name="revenue" value="725" />
                          <SubmitButton size="sm" pendingLabel="Logging...">
                            Log booking
                          </SubmitButton>
                        </form>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500">No actions</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
