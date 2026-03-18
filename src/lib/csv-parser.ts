export interface CSVParseResult {
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
  errors: string[];
}

export function parseCSV(text: string): CSVParseResult {
  const errors: string[] = [];
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [], rowCount: 0, errors: ["File is empty"] };
  }

  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length !== headers.length) {
      errors.push(`Row ${i}: expected ${headers.length} columns, got ${values.length}`);
      continue;
    }
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim() || "";
    });
    rows.push(row);
  }

  return { headers, rows, rowCount: rows.length, errors };
}

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

export interface FieldMapping {
  csvColumn: string;
  appField: string;
}

export const CONTACT_FIELDS = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "phone", label: "Phone", required: true },
  { key: "email", label: "Email", required: false },
  { key: "address", label: "Address", required: false },
  { key: "city", label: "City", required: false },
  { key: "state", label: "State", required: false },
  { key: "zip", label: "ZIP", required: false },
  { key: "tags", label: "Tags (comma-separated)", required: false },
  { key: "source", label: "Source", required: false },
] as const;

export const ESTIMATE_FIELDS = [
  { key: "estimateNumber", label: "Estimate Number", required: true },
  { key: "contactPhone", label: "Contact Phone", required: true },
  { key: "contactName", label: "Contact Name", required: false },
  { key: "amount", label: "Amount", required: true },
  { key: "serviceType", label: "Service Type", required: true },
  { key: "description", label: "Description", required: false },
  { key: "sentDate", label: "Sent Date", required: false },
] as const;

export function autoMapFields(
  csvHeaders: string[],
  targetFields: readonly { key: string; label: string }[]
): FieldMapping[] {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  return targetFields.map((field) => {
    const normalizedKey = normalize(field.key);
    const normalizedLabel = normalize(field.label);

    const match = csvHeaders.find((h) => {
      const nh = normalize(h);
      return nh === normalizedKey || nh === normalizedLabel || nh.includes(normalizedKey) || normalizedKey.includes(nh);
    });

    return {
      csvColumn: match || "",
      appField: field.key,
    };
  });
}
