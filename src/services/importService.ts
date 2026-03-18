import type { ContactRow, EstimateRow } from "@/types/revenue";

export interface ImportResult<T> {
  imported: number;
  skipped: number;
  errors: string[];
  rows: T[];
}

export async function importContacts(
  _businessId: string,
  rows: Record<string, string>[]
): Promise<ImportResult<ContactRow>> {
  const imported: ContactRow[] = [];
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    if (!row.first_name || !row.last_name) {
      errors.push(`Row ${index + 1}: missing first_name or last_name`);
      continue;
    }
    imported.push({
      id: `import-${index}`,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email || null,
      phone: row.phone || null,
      tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
      source: row.source || "csv_import",
      lastJobAt: null,
    });
  }

  return {
    imported: imported.length,
    skipped: 0,
    errors,
    rows: imported,
  };
}

export async function importEstimates(
  _businessId: string,
  rows: Record<string, string>[]
): Promise<ImportResult<EstimateRow>> {
  const imported: EstimateRow[] = [];
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    if (!row.estimate_number || !row.amount) {
      errors.push(`Row ${index + 1}: missing estimate_number or amount`);
      continue;
    }
    imported.push({
      id: `import-est-${index}`,
      number: row.estimate_number,
      amount: parseFloat(row.amount),
      status: "PENDING",
      issuedAt: row.issued_date || new Date().toISOString(),
      contactName: row.customer_name || "Unknown",
    });
  }

  return {
    imported: imported.length,
    skipped: 0,
    errors,
    rows: imported,
  };
}
