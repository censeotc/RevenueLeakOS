import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { TemplatesModule } from "@/components/templates/templates-module";

export default async function TemplatesPage() {
  const session = await requireAppPath("/app/templates");
  const templates = await prisma.template.findMany({
    where: { businessId: session.user.businessId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Create and manage reusable SMS/email templates with variables, preview, duplicate, and archive actions."
      />
      <TemplatesModule
        templates={templates.map((template) => ({
          id: template.id,
          name: template.name,
          type: template.type,
          channel: template.channel,
          body: template.body,
          isArchived: template.isArchived,
        }))}
      />
    </div>
  );
}
