export type CsvImportEntity = "contacts" | "estimates";

export interface CsvImportField {
  key: string;
  label: string;
  required: boolean;
  example: string;
}

export interface CsvImportScaffold {
  entity: CsvImportEntity;
  title: string;
  description: string;
  requiredColumns: CsvImportField[];
  optionalColumns: CsvImportField[];
  sampleRows: Array<Record<string, string>>;
}

const contactsScaffold: CsvImportScaffold = {
  entity: "contacts",
  title: "Contacts CSV import",
  description:
    "Use this import to load historical customers, homeowner lists, or exported CRM contacts into the pilot workspace.",
  requiredColumns: [
    { key: "first_name", label: "First name", required: true, example: "Ava" },
    { key: "last_name", label: "Last name", required: true, example: "Collins" },
    { key: "phone", label: "Phone", required: true, example: "+13135551099" },
  ],
  optionalColumns: [
    { key: "email", label: "Email", required: false, example: "ava@example.com" },
    { key: "address", label: "Address", required: false, example: "120 Lakeside Dr" },
    { key: "city", label: "City", required: false, example: "Grosse Pointe" },
    { key: "state", label: "State", required: false, example: "MI" },
    { key: "zip", label: "ZIP", required: false, example: "48236" },
    { key: "tags", label: "Tags", required: false, example: "residential|cooling" },
    { key: "source", label: "Source", required: false, example: "imported_list" },
    { key: "last_service_date", label: "Last service date", required: false, example: "2026-02-12" },
    { key: "lifetime_value", label: "Lifetime value", required: false, example: "1240" },
  ],
  sampleRows: [
    {
      first_name: "Ava",
      last_name: "Collins",
      phone: "+13135551099",
      email: "ava@example.com",
      tags: "residential|cooling",
      source: "jobber_export",
    },
    {
      first_name: "Leo",
      last_name: "Grant",
      phone: "+13135551123",
      email: "leo@example.com",
      tags: "commercial|plumbing",
      source: "service_titan_export",
    },
  ],
};

const estimatesScaffold: CsvImportScaffold = {
  entity: "estimates",
  title: "Estimates CSV import",
  description:
    "Use this import to stage open or stale estimates so the pilot can identify rescue opportunities without a live FSM integration.",
  requiredColumns: [
    { key: "estimate_number", label: "Estimate number", required: true, example: "EST-2026-022" },
    { key: "contact_phone", label: "Contact phone", required: true, example: "+13135551099" },
    { key: "service_type", label: "Service type", required: true, example: "AC replacement" },
    { key: "amount", label: "Amount", required: true, example: "5800" },
    { key: "sent_at", label: "Sent at", required: true, example: "2026-03-03" },
  ],
  optionalColumns: [
    { key: "contact_email", label: "Contact email", required: false, example: "ava@example.com" },
    { key: "contact_name", label: "Contact name", required: false, example: "Ava Collins" },
    { key: "status", label: "Status", required: false, example: "stale" },
    { key: "description", label: "Description", required: false, example: "4-ton AC replacement" },
    { key: "viewed_at", label: "Viewed at", required: false, example: "2026-03-04" },
    { key: "follow_up_count", label: "Follow-up count", required: false, example: "1" },
  ],
  sampleRows: [
    {
      estimate_number: "EST-2026-022",
      contact_phone: "+13135551099",
      service_type: "AC replacement",
      amount: "5800",
      sent_at: "2026-03-03",
      status: "stale",
    },
    {
      estimate_number: "EST-2026-023",
      contact_phone: "+13135551123",
      service_type: "Water heater replacement",
      amount: "3200",
      sent_at: "2026-03-10",
      status: "sent",
    },
  ],
};

const scaffoldMap: Record<CsvImportEntity, CsvImportScaffold> = {
  contacts: contactsScaffold,
  estimates: estimatesScaffold,
};

export function listCsvImportScaffolds() {
  return Object.values(scaffoldMap);
}

export function getCsvImportScaffold(entity: CsvImportEntity) {
  return scaffoldMap[entity];
}

export function parseCsvPreview(csvText: string) {
  const [headerLine, ...rows] = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!headerLine) {
    return [];
  }

  const headers = headerLine.split(",").map((header) => header.trim());

  return rows.slice(0, 5).map((row) => {
    const values = row.split(",").map((value) => value.trim());
    return headers.reduce<Record<string, string>>((previewRow, header, index) => {
      previewRow[header] = values[index] || "";
      return previewRow;
    }, {});
  });
}
