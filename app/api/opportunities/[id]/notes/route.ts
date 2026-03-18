import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { opportunityService } from "@/lib/services/opportunityService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const note = String(body.note ?? "");

  if (!note.trim()) {
    return NextResponse.json({ error: "Note is required" }, { status: 400 });
  }

  await opportunityService.addNote(id, session.user.id, note);
  return NextResponse.json({ ok: true });
}
