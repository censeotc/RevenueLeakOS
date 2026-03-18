/**
 * Lightweight CSV parser — no external dependency required.
 * Handles quoted fields, commas inside quotes, and CRLF/LF line endings.
 */

export interface ParseResult<T> {
  rows: T[];
  errors: Array<{ row: number; message: string }>;
  total: number;
  skipped: number;
}

export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    const next = normalized[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cell.trim());
        cell = "";
      } else if (ch === "\n") {
        row.push(cell.trim());
        cell = "";
        if (row.some((c) => c !== "")) lines.push(row);
        row = [];
      } else {
        cell += ch;
      }
    }
  }
  if (cell || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c !== "")) lines.push(row);
  }

  return lines;
}

// ── Contact import ────────────────────────────────────────────────────────────

export interface ContactImportRow {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  tags?: string[];
  source?: string;
  lifetimeValue?: number;
}

const CONTACT_HEADER_MAP: Record<string, keyof ContactImportRow> = {
  firstname: "firstName",
  "first name": "firstName",
  first: "firstName",
  lastname: "lastName",
  "last name": "lastName",
  last: "lastName",
  email: "email",
  phone: "phone",
  mobile: "phone",
  address: "address",
  city: "city",
  state: "state",
  zip: "zip",
  postal: "zip",
  tags: "tags",
  source: "source",
  "lifetime value": "lifetimeValue",
  ltv: "lifetimeValue",
};

export function parseContactsCSV(text: string): ParseResult<ContactImportRow> {
  const rows = parseCSV(text);
  if (rows.length < 2) {
    return { rows: [], errors: [{ row: 0, message: "No data rows found" }], total: 0, skipped: 0 };
  }

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const fieldMap = headers.map((h) => CONTACT_HEADER_MAP[h] ?? null);

  const contacts: ContactImportRow[] = [];
  const errors: Array<{ row: number; message: string }> = [];
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const obj: Partial<ContactImportRow> = {};

    fieldMap.forEach((field, colIdx) => {
      if (!field) return;
      const val = cells[colIdx]?.trim() ?? "";
      if (!val) return;
      if (field === "tags") {
        obj.tags = val.split(";").map((t) => t.trim()).filter(Boolean);
      } else if (field === "lifetimeValue") {
        obj.lifetimeValue = parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
      } else {
        (obj as Record<string, string>)[field] = val;
      }
    });

    if (!obj.firstName && !obj.lastName) {
      errors.push({ row: i + 1, message: "Missing firstName or lastName" });
      skipped++;
      continue;
    }

    contacts.push({
      firstName: obj.firstName ?? "",
      lastName: obj.lastName ?? "",
      email: obj.email,
      phone: obj.phone,
      address: obj.address,
      city: obj.city,
      state: obj.state,
      zip: obj.zip,
      tags: obj.tags ?? [],
      source: obj.source ?? "csv_import",
      lifetimeValue: obj.lifetimeValue ?? 0,
    });
  }

  return {
    rows: contacts,
    errors,
    total: rows.length - 1,
    skipped,
  };
}

// ── Estimate import ───────────────────────────────────────────────────────────

export interface EstimateImportRow {
  estimateNumber?: string;
  amount: number;
  serviceType: string;
  description?: string;
  status?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactEmail?: string;
  contactPhone?: string;
  sentAt?: Date;
}

const ESTIMATE_HEADER_MAP: Record<string, keyof EstimateImportRow> = {
  "estimate number": "estimateNumber",
  estimatenumber: "estimateNumber",
  "estimate #": "estimateNumber",
  amount: "amount",
  total: "amount",
  price: "amount",
  "service type": "serviceType",
  servicetype: "serviceType",
  service: "serviceType",
  description: "description",
  status: "status",
  firstname: "contactFirstName",
  "first name": "contactFirstName",
  lastname: "contactLastName",
  "last name": "contactLastName",
  email: "contactEmail",
  phone: "contactPhone",
  "sent at": "sentAt",
  sentat: "sentAt",
  date: "sentAt",
};

export function parseEstimatesCSV(text: string): ParseResult<EstimateImportRow> {
  const rows = parseCSV(text);
  if (rows.length < 2) {
    return { rows: [], errors: [{ row: 0, message: "No data rows found" }], total: 0, skipped: 0 };
  }

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const fieldMap = headers.map((h) => ESTIMATE_HEADER_MAP[h] ?? null);

  const estimates: EstimateImportRow[] = [];
  const errors: Array<{ row: number; message: string }> = [];
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const obj: Partial<EstimateImportRow & { sentAtRaw: string }> = {};

    fieldMap.forEach((field, colIdx) => {
      if (!field) return;
      const val = cells[colIdx]?.trim() ?? "";
      if (!val) return;
      if (field === "amount") {
        obj.amount = parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
      } else if (field === "sentAt") {
        const d = new Date(val);
        obj.sentAt = isNaN(d.getTime()) ? new Date() : d;
      } else {
        (obj as Record<string, string>)[field] = val;
      }
    });

    if (!obj.amount || !obj.serviceType) {
      errors.push({ row: i + 1, message: "Missing amount or serviceType" });
      skipped++;
      continue;
    }

    estimates.push({
      estimateNumber: obj.estimateNumber,
      amount: obj.amount,
      serviceType: obj.serviceType,
      description: obj.description,
      status: obj.status ?? "sent",
      contactFirstName: obj.contactFirstName,
      contactLastName: obj.contactLastName,
      contactEmail: obj.contactEmail,
      contactPhone: obj.contactPhone,
      sentAt: obj.sentAt ?? new Date(),
    });
  }

  return {
    rows: estimates,
    errors,
    total: rows.length - 1,
    skipped,
  };
}

// ── Template generators ───────────────────────────────────────────────────────

export const CONTACTS_CSV_TEMPLATE = `firstName,lastName,email,phone,address,city,state,zip,tags,source,lifetimeValue
John,Smith,john@example.com,+15555550100,123 Main St,Detroit,MI,48201,residential;hvac,referral,2400
Jane,Doe,jane@example.com,+15555550101,456 Oak Ave,Grosse Pointe,MI,48236,commercial;plumbing,google,0`;

export const ESTIMATES_CSV_TEMPLATE = `estimateNumber,amount,serviceType,description,status,firstName,lastName,email,phone,sentAt
EST-001,3500,Furnace Replacement,High-efficiency furnace install,sent,John,Smith,john@example.com,+15555550100,2026-03-01
EST-002,1200,AC Tune-Up,Annual AC maintenance,stale,Jane,Doe,jane@example.com,+15555550101,2026-03-05`;
