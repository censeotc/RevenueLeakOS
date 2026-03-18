import { NextResponse } from "next/server";
import { z } from "zod";

import { summarizeContactImport } from "@/services/importService";
import { contactImportRowSchema } from "@/lib/validators/contact";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = z.array(contactImportRowSchema).safeParse(body.rows ?? []);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }
  return NextResponse.json(summarizeContactImport(result.data));
}
