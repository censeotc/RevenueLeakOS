import { NextRequest, NextResponse } from "next/server";
import { parseCSV, autoMapFields, CONTACT_FIELDS } from "@/lib/csv-parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const parsed = parseCSV(text);

    if (parsed.headers.length === 0) {
      return NextResponse.json({ error: "Invalid CSV file" }, { status: 400 });
    }

    const mappings = autoMapFields(parsed.headers, CONTACT_FIELDS);

    const contacts = parsed.rows.map((row, i) => {
      const contact: Record<string, string> = {};
      for (const mapping of mappings) {
        if (mapping.csvColumn) {
          contact[mapping.appField] = row[mapping.csvColumn] || "";
        }
      }
      contact._rowIndex = String(i + 1);
      return contact;
    });

    const valid = contacts.filter(
      (c) => c.firstName && c.lastName && c.phone
    );
    const invalid = contacts.filter(
      (c) => !c.firstName || !c.lastName || !c.phone
    );

    return NextResponse.json({
      total: parsed.rowCount,
      imported: valid.length,
      skipped: invalid.length,
      contacts: valid,
      errors: [
        ...parsed.errors,
        ...invalid.map((c) => `Row ${c._rowIndex}: missing required fields`),
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process CSV file" },
      { status: 500 }
    );
  }
}
