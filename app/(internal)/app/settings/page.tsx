import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { SettingsModule } from "@/components/settings/settings-module";

export default async function SettingsPage() {
  const session = await requireAppPath("/app/settings");
  const [business, users] = await Promise.all([
    prisma.business.findUnique({ where: { id: session.user.businessId } }),
    prisma.user.findMany({
      where: { businessId: session.user.businessId },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!business) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Business configuration, user roles, messaging controls, attribution logic, and compliance."
      />
      <SettingsModule
        business={{
          name: business.name,
          timezone: business.timezone,
          staleEstimateDays: business.staleEstimateDays,
          attributionWindowDays: business.attributionWindowDays,
          highValueThreshold: business.highValueThreshold,
        }}
        users={users}
      />
    </div>
  );
}
