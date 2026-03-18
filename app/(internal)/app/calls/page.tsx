import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { CallsModule } from "@/components/calls/calls-module";

export default async function CallsPage() {
  const session = await requireAppPath("/app/calls");
  const calls = await prisma.callEvent.findMany({
    where: { businessId: session.user.businessId },
    include: {
      contact: true,
      opportunity: {
        include: {
          messageEvents: {
            where: { channel: "sms" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          bookings: { take: 1 },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Calls"
        description="Triage missed, after-hours, and abandoned calls with linked opportunity outcomes."
      />
      <CallsModule
        rows={calls.map((call) => ({
          id: call.id,
          startedAt: call.startedAt.toISOString(),
          fromNumber: call.fromNumber,
          intakeSummary: call.intakeSummary,
          isMissed: call.isMissed,
          isAfterHours: call.isAfterHours,
          isAbandoned: call.isAbandoned,
          opportunityStatus: call.opportunity?.status ?? null,
          contactName: call.contact?.fullName ?? null,
          smsPreview: call.opportunity?.messageEvents[0]?.body ?? null,
          hasBooking: (call.opportunity?.bookings.length ?? 0) > 0,
        }))}
      />
    </div>
  );
}
