import Link from "next/link";
import { differenceInDays } from "date-fns";
import { EstimateStatus } from "@prisma/client";
import { SectionHeader } from "@/components/section-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getEstimates } from "@/lib/services/revenueleak";
import { formatCurrency } from "@/lib/utils";
import {
  enrollEstimateAction,
  setEstimateOutcomeAction,
  syncStaleEstimateAction,
} from "@/app/actions";

const statuses: Array<{ value: "all" | EstimateStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "stale", label: "Stale" },
  { value: "sent", label: "Sent" },
  { value: "enrolled_followup", label: "Enrolled" },
  { value: "responded", label: "Responded" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
];

type SearchParams = { status?: "all" | EstimateStatus };

export default async function EstimatesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getSessionUser();
  const params = await searchParams;
  const status = params.status ?? "all";
  const estimates = await getEstimates(user.businessId, status);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Estimates"
        description="Stale estimate rescue workflow with follow-up enrollment and outcomes."
        actions={
          <form action={syncStaleEstimateAction}>
            <Button type="submit" variant="outline" size="sm">
              Refresh stale opportunities
            </Button>
          </form>
        }
      />

      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Link
            key={item.value}
            href={`/app/estimates?status=${item.value}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              status === item.value
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
          <CardTitle>Stale estimate list</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estimate</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Age (days)</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell>{estimate.estimateNo}</TableCell>
                  <TableCell>
                    {estimate.contact.firstName} {estimate.contact.lastName}
                  </TableCell>
                  <TableCell>{differenceInDays(new Date(), estimate.sentAt)}</TableCell>
                  <TableCell>{formatCurrency(Number(estimate.amount))}</TableCell>
                  <TableCell>{estimate.serviceType}</TableCell>
                  <TableCell>
                    <Badge variant={estimate.status === "booked" ? "success" : "outline"}>
                      {estimate.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <form action={enrollEstimateAction}>
                        <input type="hidden" name="estimateId" value={estimate.id} />
                        <SubmitButton size="sm" variant="outline" pendingLabel="Enrolling...">
                          Enroll in follow-up
                        </SubmitButton>
                      </form>
                      <form action={setEstimateOutcomeAction}>
                        <input type="hidden" name="estimateId" value={estimate.id} />
                        <input type="hidden" name="status" value="responded" />
                        <SubmitButton size="sm" variant="secondary" pendingLabel="Updating...">
                          Mark responded
                        </SubmitButton>
                      </form>
                      <form action={setEstimateOutcomeAction}>
                        <input type="hidden" name="estimateId" value={estimate.id} />
                        <input type="hidden" name="status" value="booked" />
                        <input type="hidden" name="revenue" value={estimate.amount.toString()} />
                        <SubmitButton size="sm" pendingLabel="Booking...">
                          Mark booked
                        </SubmitButton>
                      </form>
                      <form action={setEstimateOutcomeAction}>
                        <input type="hidden" name="estimateId" value={estimate.id} />
                        <input type="hidden" name="status" value="lost" />
                        <SubmitButton size="sm" variant="destructive" pendingLabel="Updating...">
                          Mark lost
                        </SubmitButton>
                      </form>
                    </div>
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
