import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const clone = await prisma.template.create({
    data: {
      businessId: template.businessId,
      createdById: session.user.id,
      name: `${template.name} (Copy)`,
      description: template.description,
      type: template.type,
      channel: template.channel,
      subject: template.subject,
      body: template.body,
    },
  });

  return NextResponse.json({ ok: true, templateId: clone.id });
}
