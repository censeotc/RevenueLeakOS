import Link from "next/link";

import {
  addOpportunityNoteAction,
  assignOpportunityAction,
  updateOpportunityStatusAction,
} from "@/app/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getOpportunityById, getOpportunities, getUsers } from "@/lib/data/selectors";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

import { OpportunitiesTable } from "./opportunities-table";

export const dynamic = "force-dynamic";

const typeFilters = [
  { label: "All", value: "all" },
  { label: "Missed Call", value: "missed_call" },
  { label: "Estimate Rescue", value: "estimate_rescue" },
  { label: "Reactivation", value: "reactivation" },
];

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string }>;
}) {
  const params = await searchParams;
  const currentType = params.type ?? "all";
  const opportunities =
    currentType === "all" ? getOpportunities() : getOpportunities(currentType as never);
  const selected = getOpportunityById(params.id ?? opportunities[0]?.id);
  const users = getUsers();

  return (
    <>
      <PageHeader
        eyebrow="Opportunity inbox"
        title="Unified recovery opportunities"
        description="Every workflow rolls into a single opportunity model so teams can assign, update, note, and recover revenue from one place."
      />

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => (
          <Button
            key={filter.value}
            asChild
            variant={currentType === filter.value ? "default" : "outline"}
            size="sm"
          >
            <Link href={`/app/opportunities?type=${filter.value}`}>{filter.label}</Link>
          </Button>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Opportunity queue</CardTitle>
            <CardDescription>
              Status, owner, contact, and value across missed calls, stale estimates, and dormant outreach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OpportunitiesTable data={opportunities} currentType={currentType} />
          </CardContent>
        </Card>

        {selected ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{selected.title}</CardTitle>
                    <CardDescription>{selected.description ?? selected.intakeSummary}</CardDescription>
                  </div>
                  <StatusBadge value={selected.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-slate-500">Contact</p>
                    <p className="font-medium text-slate-900">
                      {selected.contact.firstName} {selected.contact.lastName}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-slate-500">Value</p>
                    <p className="font-medium text-slate-900">{formatCurrency(selected.value)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-slate-500">Service</p>
                    <p className="font-medium text-slate-900">{selected.serviceType}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-slate-500">Owner</p>
                    <p className="font-medium text-slate-900">{selected.owner?.name ?? "Unassigned"}</p>
                  </div>
                </div>

                <form action={assignOpportunityAction} className="space-y-2">
                  <input type="hidden" name="opportunityId" value={selected.id} />
                  <label className="text-sm font-medium text-slate-700">Assignment</label>
                  <Select name="ownerId" defaultValue={selected.owner?.id ?? users[0]?.id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" type="submit">
                    Update owner
                  </Button>
                </form>

                <form action={updateOpportunityStatusAction} className="space-y-2">
                  <input type="hidden" name="opportunityId" value={selected.id} />
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <Select name="status" defaultValue={selected.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["new", "attempted", "responded", "qualified", "booked", "lost", "paused", "closed"].map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace(/_/g, " ")}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Button size="sm" type="submit" variant="outline">
                    Save status
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>CSR and manager context on the selected opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={addOpportunityNoteAction} className="space-y-3">
                  <input type="hidden" name="opportunityId" value={selected.id} />
                  <input type="hidden" name="authorId" value={users[0]?.id} />
                  <Textarea name="body" placeholder="Add a note for the team..." />
                  <Button size="sm" type="submit">
                    Save note
                  </Button>
                </form>
                <div className="space-y-3">
                  {selected.notes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-slate-200 p-3">
                      <p className="text-sm text-slate-700">{note.body}</p>
                      <p className="mt-2 text-xs text-slate-400">{formatRelativeTime(note.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity timeline</CardTitle>
                <CardDescription>Notes, replies, and workflow events tied to this opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...selected.activities, ...selected.notes.map((note) => ({
                  id: note.id,
                  title: "Note added",
                  message: note.body,
                  createdAt: note.createdAt,
                }))]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((item) => (
                    <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.message}</p>
                      <p className="mt-1 text-xs text-slate-400">{formatRelativeTime(item.createdAt)}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-sm text-slate-500">
              No opportunities found for this filter.
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}
