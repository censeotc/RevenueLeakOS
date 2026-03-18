import { NextResponse } from "next/server";
import { importService } from "@/lib/services/importService";

export async function POST(request: Request) {
  const body = await request.json();
  const csvText = String(body.csvText ?? "");
  const kind = body.kind === "estimates" ? "estimates" : "contacts";

  if (!csvText.trim()) {
    return NextResponse.json({ error: "CSV text is required" }, { status: 400 });
  }

  const headers = importService.detectHeaders(csvText);
  const mapping = importService.mapFields(headers, kind);
  const validation = importService.validateRows(
    csvText,
    kind === "contacts" ? ["first_name", "last_name", "phone"] : ["contact_email", "amount", "service_type"],
  );

  return NextResponse.json({
    headers,
    mapping,
    ...validation,
  });
}
