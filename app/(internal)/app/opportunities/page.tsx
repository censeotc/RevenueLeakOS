import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { OpportunitiesBoard } from "@/components/opportunities/opportunities-board";

export default async function OpportunitiesPage() {
  const session = await requireAppPath("/app/opportunities");
  const [opportunities, users, activityLogs] = await Promise.all([
    prisma.opportunity.findMany({
      where: { businessId: session.user.businessId },
      include: {
        contact: true,
        owner: true,
        notes: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 5 },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { businessId: session.user.businessId, isActive: true },
      select: { id: true, name: true },
    }),
    prisma.activityLog.findMany({
      where: { businessId: session.user.businessId },
      orderBy: { createdAt: "desc" },
      take: 120,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Opportunities"
        description="Unified inbox for missed calls, estimate rescue, and reactivation opportunities."
      />
      <OpportunitiesBoard
        rows={opportunities.map((opportunity) => ({
          id: opportunity.id,
          type: opportunity.type,
          status: opportunity.status,
          title: opportunity.title,
          serviceType: opportunity.serviceType,
          value: opportunity.value,
          ownerId: opportunity.ownerId,
          ownerName: opportunity.owner?.name ?? "Unassigned",
          contactName: opportunity.contact.fullName,
          createdAt: opportunity.createdAt.toISOString(),
          notes: opportunity.notes.map((note) => ({
            id: note.id,
            body: note.body,
            userName: note.user.name,
            createdAt: note.createdAt.toISOString(),
          })),
          activity: activityLogs
            .filter((activity) => activity.opportunityId === opportunity.id)
            .slice(0, 5)
            .map((activity) => ({
              id: activity.id,
              summary: activity.summary,
              createdAt: activity.createdAt.toISOString(),
            })),
        }))}
        owners={users}
      />
    </div>
  );
}
