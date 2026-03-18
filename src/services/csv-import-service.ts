import type { Contact, Estimate } from "@/types/domain";
import { getStore } from "@/lib/demo-data";

export type CsvImportEntity = "contacts" | "estimates";

type CsvColumnDefinition = {
  source: string;
  target: string;
  required: boolean;
  description: string;
};

type CsvPreviewRow = Record<string, string>;

function mapContactRow(contact: Contact): CsvPreviewRow {
  return {
    first_name: contact.firstName,
    last_name: contact.lastName,
    phone: contact.phone,
    email: contact.email ?? "",
    tags: contact.tags.join("|"),
    lifecycle_stage: contact.lifecycleStage,
  };
}

function mapEstimateRow(estimate: Estimate) {
  return {
    estimate_number: estimate.number,
    service_type: estimate.serviceType,
    amount: String(Math.round(estimate.amountCents / 100)),
    status: estimate.status,
    sent_at: estimate.sentAt,
    contact_id: estimate.contactId,
  };
}

const importDefinitions: Record<CsvImportEntity, { columns: CsvColumnDefinition[]; sampleFileName: string }> = {
  contacts: {
    sampleFileName: "contacts-import-template.csv",
    columns: [
      { source: "first_name", target: "firstName", required: true, description: "Customer or lead first name." },
      { source: "last_name", target: "lastName", required: true, description: "Customer or lead last name." },
      { source: "phone", target: "phone", required: true, description: "Primary SMS-capable number." },
      { source: "email", target: "email", required: false, description: "Optional contact email." },
      { source: "tags", target: "tags[]", required: false, description: "Pipe-delimited tags used for segmentation." },
      { source: "lifecycle_stage", target: "lifecycleStage", required: false, description: "lead, customer, maintenance-plan, etc." },
    ],
  },
  estimates: {
    sampleFileName: "estimates-import-template.csv",
    columns: [
      { source: "estimate_number", target: "number", required: true, description: "External quote identifier." },
      { source: "service_type", target: "serviceType", required: true, description: "Install or service label." },
      { source: "amount", target: "amountCents", required: true, description: "Whole-dollar amount converted to cents." },
      { source: "status", target: "status", required: true, description: "open, stale, responded, booked, lost." },
      { source: "sent_at", target: "sentAt", required: true, description: "Original sent timestamp for stale-age calculations." },
      { source: "contact_id", target: "contactId", required: true, description: "Link back to an imported or existing contact." },
    ],
  },
};

export const csvImportService = {
  getImportScaffold(entity: CsvImportEntity) {
    const store = getStore();
    const previewRows =
      entity === "contacts"
        ? store.contacts.slice(0, 3).map(mapContactRow)
        : store.estimates.slice(0, 3).map(mapEstimateRow);

    return {
      entity,
      sampleFileName: importDefinitions[entity].sampleFileName,
      columns: importDefinitions[entity].columns,
      previewRows,
      checklist: [
        "Upload CSV export from your field-service system or CRM.",
        "Map source columns into RevenueLeak OS fields.",
        "Review duplicate and missing-key warnings before import.",
        "Confirm preview counts for contacts, estimates, and linked opportunities.",
      ],
    };
  },

  previewCsvImport(entity: CsvImportEntity) {
    const scaffold = this.getImportScaffold(entity);

    return {
      ok: true,
      entity,
      matchedRows: scaffold.previewRows.length,
      warnings: [
        "Duplicate phone resolution will be handled in a later importer iteration.",
        "This MVP scaffold validates mappings and preview rows only.",
      ],
      previewRows: scaffold.previewRows,
    };
  },
};
