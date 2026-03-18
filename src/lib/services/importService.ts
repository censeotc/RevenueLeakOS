export interface ParsedCSVResult {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  errors: CSVParseError[];
}

export interface CSVParseError {
  row: number;
  message: string;
}

export interface DetectedHeader {
  original: string;
  suggested: string | null;
  confidence: number;
}

export interface FieldMapping {
  csvHeader: string;
  modelField: string;
  isRequired: boolean;
}

export interface ValidationResult {
  valid: boolean;
  validRows: Record<string, string>[];
  invalidRows: { row: number; errors: string[] }[];
  totalValid: number;
  totalInvalid: number;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

const KNOWN_HEADER_MAP: Record<string, string> = {
  "first name": "firstName",
  "firstname": "firstName",
  "first": "firstName",
  "last name": "lastName",
  "lastname": "lastName",
  "last": "lastName",
  "email": "email",
  "email address": "email",
  "phone": "phone",
  "phone number": "phone",
  "mobile": "phone",
  "cell": "phone",
  "address": "address",
  "street": "address",
  "street address": "address",
  "city": "city",
  "state": "state",
  "zip": "zip",
  "zip code": "zip",
  "zipcode": "zip",
  "postal code": "zip",
  "type": "type",
  "customer type": "type",
  "contact type": "type",
  "tags": "tags",
  "notes": "notes",
  "source": "source",
  "title": "title",
  "amount": "amount",
  "estimate amount": "amount",
  "total": "amount",
  "service type": "serviceType",
  "service": "serviceType",
  "status": "status",
  "sent date": "sentAt",
  "date sent": "sentAt",
  "created": "createdAt",
  "created at": "createdAt",
  "date": "createdAt",
};

export async function parseCSV(fileContent: string): Promise<ParsedCSVResult> {
  const lines = fileContent.trim().split("\n");
  const errors: CSVParseError[] = [];

  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0, errors: [{ row: 0, message: "Empty file" }] };
  }

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] ?? "";
      });
      rows.push(row);
    } catch {
      errors.push({ row: i + 1, message: "Failed to parse row" });
    }
  }

  return {
    headers,
    rows,
    totalRows: rows.length,
    errors,
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }

  result.push(current.trim());
  return result;
}

export async function detectHeaders(
  headers: string[]
): Promise<DetectedHeader[]> {
  return headers.map((header) => {
    const normalized = header.toLowerCase().trim();
    const suggested = KNOWN_HEADER_MAP[normalized] ?? null;
    const confidence = suggested ? 0.95 : 0;

    return {
      original: header,
      suggested,
      confidence,
    };
  });
}

export async function mapFields(
  headers: string[],
  mapping: Record<string, string>
): Promise<FieldMapping[]> {
  const contactRequired = ["firstName", "lastName", "phone"];

  return headers.map((header) => {
    const modelField = mapping[header] ?? "";
    return {
      csvHeader: header,
      modelField,
      isRequired: contactRequired.includes(modelField),
    };
  });
}

export async function validateRows(
  rows: Record<string, string>[],
  schema: "contacts" | "estimates"
): Promise<ValidationResult> {
  const validRows: Record<string, string>[] = [];
  const invalidRows: { row: number; errors: string[] }[] = [];

  rows.forEach((row, index) => {
    const errors: string[] = [];

    if (schema === "contacts") {
      if (!row.firstName && !row.first_name) {
        errors.push("First name is required");
      }
      if (!row.lastName && !row.last_name) {
        errors.push("Last name is required");
      }
      if (!row.phone && !row.mobile) {
        errors.push("Phone number is required");
      }
      if (row.phone && !/^[+\d\s()-]{7,}$/.test(row.phone)) {
        errors.push("Invalid phone number format");
      }
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push("Invalid email format");
      }
    } else if (schema === "estimates") {
      if (!row.title) {
        errors.push("Title is required");
      }
      if (!row.amount) {
        errors.push("Amount is required");
      }
      if (row.amount && isNaN(parseFloat(row.amount))) {
        errors.push("Amount must be a number");
      }
      if (!row.contactId && !row.phone) {
        errors.push("Contact ID or phone is required");
      }
    }

    if (errors.length === 0) {
      validRows.push(row);
    } else {
      invalidRows.push({ row: index + 1, errors });
    }
  });

  return {
    valid: invalidRows.length === 0,
    validRows,
    invalidRows,
    totalValid: validRows.length,
    totalInvalid: invalidRows.length,
  };
}

export async function importContacts(
  rows: Record<string, string>[]
): Promise<ImportResult> {
  let imported = 0;
  let skipped = 0;
  const errors: { row: number; message: string }[] = [];

  rows.forEach((row, index) => {
    if (!row.firstName || !row.phone) {
      skipped++;
      errors.push({ row: index + 1, message: "Missing required fields" });
      return;
    }
    imported++;
  });

  console.log(
    `[ImportService] Contacts imported: ${imported}, skipped: ${skipped}`
  );

  return {
    success: errors.length === 0,
    imported,
    skipped,
    errors,
  };
}

export async function importEstimates(
  rows: Record<string, string>[]
): Promise<ImportResult> {
  let imported = 0;
  let skipped = 0;
  const errors: { row: number; message: string }[] = [];

  rows.forEach((row, index) => {
    if (!row.title || !row.amount) {
      skipped++;
      errors.push({ row: index + 1, message: "Missing required fields" });
      return;
    }
    if (isNaN(parseFloat(row.amount))) {
      skipped++;
      errors.push({ row: index + 1, message: "Invalid amount" });
      return;
    }
    imported++;
  });

  console.log(
    `[ImportService] Estimates imported: ${imported}, skipped: ${skipped}`
  );

  return {
    success: errors.length === 0,
    imported,
    skipped,
    errors,
  };
}
