import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { opportunityService } from "@/lib/services/opportunityService";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const ownerId = String(body.ownerId ?? "");
  if (!ownerId) {
    return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
  }

  await opportunityService.assign(id, ownerId);
  return NextResponse.json({ ok: true });
}
