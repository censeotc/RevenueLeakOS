import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { ReactivationModule } from "@/components/reactivation/reactivation-module";

export default async function ReactivationPage() {
  const session = await requireAppPath("/app/reactivation");
  const contacts = await prisma.contact.findMany({
    where: {
      businessId: session.user.businessId,
      status: "dormant",
    },
    orderBy: { lastServiceAt: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Reactivation"
        description="Build dormant-customer segments and launch win-back campaigns that generate new opportunities."
      />
      <ReactivationModule
        contacts={contacts.map((contact) => ({
          id: contact.id,
          fullName: contact.fullName,
          phone: contact.phone,
          lifetimeValue: contact.lifetimeValue,
          lastServiceAt: contact.lastServiceAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
