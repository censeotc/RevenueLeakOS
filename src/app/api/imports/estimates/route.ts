import { NextResponse } from "next/server";
import { z } from "zod";

import { summarizeEstimateImport } from "@/services/importService";
import { estimateImportRowSchema } from "@/lib/validators/estimate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = z.array(estimateImportRowSchema).safeParse(body.rows ?? []);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }
  return NextResponse.json(summarizeEstimateImport(result.data));
}
