import { NextRequest, NextResponse } from "next/server";
import { parseCSV, autoMapFields, ESTIMATE_FIELDS } from "@/lib/csv-parser";

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

    const mappings = autoMapFields(parsed.headers, ESTIMATE_FIELDS);

    const estimates = parsed.rows.map((row, i) => {
      const estimate: Record<string, string> = {};
      for (const mapping of mappings) {
        if (mapping.csvColumn) {
          estimate[mapping.appField] = row[mapping.csvColumn] || "";
        }
      }
      estimate._rowIndex = String(i + 1);
      return estimate;
    });

    const valid = estimates.filter(
      (e) => e.estimateNumber && e.contactPhone && e.amount && e.serviceType
    );
    const invalid = estimates.filter(
      (e) => !e.estimateNumber || !e.contactPhone || !e.amount || !e.serviceType
    );

    return NextResponse.json({
      total: parsed.rowCount,
      imported: valid.length,
      skipped: invalid.length,
      estimates: valid,
      errors: [
        ...parsed.errors,
        ...invalid.map((e) => `Row ${e._rowIndex}: missing required fields`),
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process CSV file" },
      { status: 500 }
    );
  }
}
