import Link from "next/link";
import { ReactivationSegmentKey } from "@/lib/types";
import { SectionHeader } from "@/components/section-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUser } from "@/lib/session";
import { getReactivationSegments } from "@/lib/services/revenueleak";
import { formatCurrency } from "@/lib/utils";
import { launchReactivationAction } from "@/app/actions";

type SearchParams = { segment?: ReactivationSegmentKey };

const segmentOrder: ReactivationSegmentKey[] = [
  "no_service_12_months",
  "maintenance_due",
  "membership_renewal",
  "replacement_cycle",
];

export default async function ReactivationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getSessionUser();
  const params = await searchParams;
  const segments = await getReactivationSegments(user.businessId);
  const selected = params.segment ?? "no_service_12_months";
  const selectedSegment = segments[selected];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Reactivation"
        description="Segment dormant customers and launch reactivation opportunities."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {segmentOrder.map((key) => {
          const item = segments[key];
          const active = selected === key;
          return (
            <Link
              key={key}
              href={`/app/reactivation?segment=${key}`}
              className={`rounded-lg border p-4 ${
                active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
              }`}
            >
              <p className={`text-sm ${active ? "text-slate-200" : "text-slate-500"}`}>Segment</p>
              <p className="text-base font-semibold">{item.label}</p>
              <p className={`mt-2 text-sm ${active ? "text-slate-200" : "text-slate-600"}`}>
                {item.count} contacts • {formatCurrency(item.estimatedValue)}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preview table: {selectedSegment.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Estimated Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSegment.contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(1800)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Launch campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">
              Estimated opportunity value:{" "}
              <span className="font-semibold text-slate-900">
                {formatCurrency(selectedSegment.estimatedValue)}
              </span>
            </p>
            <form action={launchReactivationAction}>
              <input type="hidden" name="segment" value={selected} />
              <SubmitButton pendingLabel="Launching..." className="w-full">
                Launch campaign
              </SubmitButton>
            </form>
            <p className="text-xs text-slate-500">
              Launching creates reactivation opportunities and starts campaign messaging.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
