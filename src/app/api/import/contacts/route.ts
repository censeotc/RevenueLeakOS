import { NextRequest, NextResponse } from "next/server";
import { parseContactsCSV, CONTACTS_CSV_TEMPLATE } from "@/lib/csv-parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      return NextResponse.json({ error: "File must be a CSV" }, { status: 400 });
    }

    const text = await file.text();
    const result = parseContactsCSV(text);

    // In production: persist result.rows to the database here.
    // For demo mode we just return the parsed preview.

    return NextResponse.json({
      ok: true,
      imported: result.rows.length,
      skipped: result.skipped,
      total: result.total,
      errors: result.errors,
      preview: result.rows.slice(0, 5),
    });
  } catch (err) {
    console.error("[import/contacts]", err);
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse(CONTACTS_CSV_TEMPLATE, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="contacts_template.csv"',
    },
  });
}
