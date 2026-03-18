import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { templateEditorSchema } from "@/lib/domain/types";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = templateEditorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const template = await prisma.template.create({
    data: {
      businessId: session.user.businessId,
      createdById: session.user.id,
      name: parsed.data.name,
      type: parsed.data.type,
      channel: parsed.data.channel,
      body: parsed.data.body,
    },
  });

  return NextResponse.json({ ok: true, templateId: template.id });
}
