import Link from "next/link";
import { OpportunityType } from "@prisma/client";
import { SectionHeader } from "@/components/section-header";
import {
  OpportunityStatusBadge,
  OpportunityTypeBadge,
} from "@/components/status-badges";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getSessionUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";
import {
  getOpportunityById,
  getOpportunityList,
  getUsersByBusiness,
} from "@/lib/services/opportunityService";
import { addOpportunityNoteAction, assignOpportunityOwnerAction } from "@/app/actions";

type SearchParams = {
  type?: "all" | OpportunityType;
  selected?: string;
};

const filters: Array<{ value: "all" | OpportunityType; label: string }> = [
  { value: "all", label: "All" },
  { value: "missed_call", label: "Missed Call" },
  { value: "estimate_rescue", label: "Estimate Rescue" },
  { value: "reactivation", label: "Reactivation" },
];

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getSessionUser();
  const params = await searchParams;
  const type = params.type ?? "all";
  const opportunities = await getOpportunityList(user.businessId, type);
  const selectedId = params.selected ?? opportunities[0]?.id;
  const selected = selectedId ? await getOpportunityById(selectedId) : null;
  const users = await getUsersByBusiness(user.businessId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Opportunities"
        description="Unified opportunity pipeline across missed calls, stale estimates, and reactivation."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Link
            key={item.value}
            href={`/app/opportunities?type=${item.value}`}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              type === item.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Opportunity table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Potential</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell>
                      <OpportunityTypeBadge type={opportunity.type} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/app/opportunities?type=${type}&selected=${opportunity.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {opportunity.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <OpportunityStatusBadge status={opportunity.status} />
                    </TableCell>
                    <TableCell>
                      {opportunity.contact.firstName} {opportunity.contact.lastName}
                    </TableCell>
                    <TableCell>{opportunity.assignedUser?.name ?? "Unassigned"}</TableCell>
                    <TableCell>{formatCurrency(Number(opportunity.potentialValue))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selected ? (
              <p className="text-sm text-slate-500">Select an opportunity to view details.</p>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{selected.title}</p>
                  <p className="text-xs text-slate-500">
                    {selected.contact.firstName} {selected.contact.lastName} •{" "}
                    {selected.contact.phone}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <OpportunityTypeBadge type={selected.type} />
                  <OpportunityStatusBadge status={selected.status} />
                  <Badge variant="secondary">
                    Influenced {formatCurrency(Number(selected.influencedValue))}
                  </Badge>
                </div>

                <form action={assignOpportunityOwnerAction} className="space-y-2">
                  <input type="hidden" name="opportunityId" value={selected.id} />
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Owner assignment
                  </label>
                  <Select
                    name="assignedUserId"
                    defaultValue={selected.assignedUserId ?? ""}
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </Select>
                  <SubmitButton size="sm" pendingLabel="Updating...">
                    Update owner
                  </SubmitButton>
                </form>

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</p>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {selected.notes.length === 0 ? (
                      <p className="text-sm text-slate-500">No notes yet.</p>
                    ) : (
                      selected.notes.map((note) => (
                        <div key={note.id} className="rounded-md border border-slate-200 p-2">
                          <p className="text-sm text-slate-800">{note.content}</p>
                          <p className="text-xs text-slate-500">
                            {note.createdAt.toLocaleString("en-US")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <form action={addOpportunityNoteAction} className="space-y-2">
                    <input type="hidden" name="opportunityId" value={selected.id} />
                    <Textarea name="content" placeholder="Add note..." />
                    <SubmitButton size="sm" pendingLabel="Saving...">
                      Add note
                    </SubmitButton>
                  </form>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
