import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { EstimatesModule } from "@/components/estimates/estimates-module";

export default async function EstimatesPage() {
  const session = await requireAppPath("/app/estimates");
  const [business, estimates] = await Promise.all([
    prisma.business.findUnique({ where: { id: session.user.businessId } }),
    prisma.estimate.findMany({
      where: { businessId: session.user.businessId },
      include: { contact: true },
      orderBy: { sentAt: "desc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Estimates"
        description="Rescue stale estimates with follow-up enrollment and status controls."
      />
      <EstimatesModule
        staleThresholdDays={business?.staleEstimateDays ?? 7}
        rows={estimates.map((estimate) => ({
          id: estimate.id,
          contactName: estimate.contact.fullName,
          amount: estimate.amount,
          serviceType: estimate.serviceType,
          status: estimate.status,
          sentAt: estimate.sentAt.toISOString(),
        }))}
      />
    </div>
  );
}
