import { PageHeader } from "@/components/layout/page-header";
import { requireAppPath } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { ContactsModule } from "@/components/contacts/contacts-module";

export default async function ContactsPage() {
  const session = await requireAppPath("/app/contacts");
  const contacts = await prisma.contact.findMany({
    where: { businessId: session.user.businessId },
    include: {
      opportunities: {
        select: {
          id: true,
          title: true,
          status: true,
          notes: {
            select: { id: true, body: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Manage contacts, tags, notes, linked opportunities, and CSV import scaffolds."
      />
      <ContactsModule
        contacts={contacts.map((contact) => ({
          id: contact.id,
          fullName: contact.fullName,
          phone: contact.phone,
          email: contact.email,
          tags: contact.tags,
          status: contact.status,
          type: contact.type,
          opportunities: contact.opportunities.map((opportunity) => ({
            id: opportunity.id,
            title: opportunity.title,
            status: opportunity.status,
          })),
          notes: contact.opportunities.flatMap((opportunity) =>
            opportunity.notes.map((note) => ({
              id: note.id,
              body: note.body,
              createdAt: note.createdAt.toISOString(),
            })),
          ),
        }))}
      />
    </div>
  );
}
