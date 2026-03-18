import { parse } from "csv-parse/sync";

const contactFieldOptions = ["firstName", "lastName", "email", "phone", "type", "status"] as const;
const estimateFieldOptions = [
  "estimateNumber",
  "serviceType",
  "amount",
  "sentAt",
  "contactEmail",
] as const;

export type ImportMode = "contacts" | "estimates";

export function detectHeaders(csvText: string) {
  const rows = parse(csvText, {
    bom: true,
    skip_empty_lines: true,
  }) as string[][];

  return rows[0] ?? [];
}

export function suggestMapping(headers: string[], mode: ImportMode) {
  const fields = mode === "contacts" ? contactFieldOptions : estimateFieldOptions;
  return headers.reduce<Record<string, string>>((accumulator, header) => {
    const match = fields.find((field) => field.toLowerCase() === header.toLowerCase());
    accumulator[header] = match ?? "";
    return accumulator;
  }, {});
}

export function validateCsvRows(csvText: string, mode: ImportMode) {
  const records = parse(csvText, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as Array<Record<string, string>>;

  return records.map((record, index) => {
    const errors: string[] = [];

    if (mode === "contacts") {
      if (!record.phone) errors.push("Phone is required");
      if (!record.firstName && !record["First Name"]) errors.push("First name is required");
    }

    if (mode === "estimates") {
      if (!record.amount) errors.push("Amount is required");
      if (!record.serviceType && !record["Service Type"]) errors.push("Service type is required");
    }

    return {
      rowNumber: index + 2,
      record,
      isValid: errors.length === 0,
      errors,
    };
  });
}
