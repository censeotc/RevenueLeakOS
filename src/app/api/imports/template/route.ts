import { NextRequest, NextResponse } from "next/server";
import { getCsvTemplate } from "@/services/csvImportService";

export async function GET(request: NextRequest) {
  const entity = request.nextUrl.searchParams.get("entity");
  if (entity !== "contacts" && entity !== "estimates") {
    return NextResponse.json({ error: "Invalid import entity" }, { status: 400 });
  }

  const template = getCsvTemplate(entity);
  return new NextResponse(template, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entity}-template.csv"`,
    },
  });
}
