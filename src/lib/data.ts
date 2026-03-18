/**
 * Data access layer — returns demo data in all environments.
 * Swap implementations here when connecting a real database.
 */

import {
  demoBusiness,
  demoUsers,
  demoContacts,
  demoOpportunities,
  demoCallEvents,
  demoEstimates,
  demoTemplates,
  demoCampaigns,
  demoMessages,
  demoBookings,
  demoActivityLogs,
  demoReportSnapshots,
  demoIntegrations,
  dashboardSummary,
  demoAlerts,
} from "./demo-data";

// ── Business ──────────────────────────────────────────────────────────────────

export async function getBusiness(businessId: string) {
  if (businessId === demoBusiness.id) return demoBusiness;
  return demoBusiness;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getUsers(businessId: string) {
  return demoUsers;
}

export async function getUserById(id: string) {
  return demoUsers.find((u) => u.id === id) ?? null;
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export async function getContacts(
  businessId: string,
  opts?: { search?: string; tag?: string }
) {
  let result = demoContacts;
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
    );
  }
  if (opts?.tag) {
    result = result.filter((c) => c.tags.includes(opts.tag!));
  }
  return result;
}

export async function getContactById(id: string) {
  return demoContacts.find((c) => c.id === id) ?? null;
}

// ── Opportunities ─────────────────────────────────────────────────────────────

export async function getOpportunities(
  businessId: string,
  opts?: {
    type?: "missed_call" | "estimate_rescue" | "reactivation" | "all";
    status?: string;
  }
) {
  let result = demoOpportunities;
  if (opts?.type && opts.type !== "all") {
    result = result.filter((o) => o.type === opts.type);
  }
  if (opts?.status) {
    result = result.filter((o) => o.status === opts.status);
  }
  return result;
}

export async function getOpportunityById(id: string) {
  return demoOpportunities.find((o) => o.id === id) ?? null;
}

export async function getOpportunitiesForContact(contactId: string) {
  return demoOpportunities.filter((o) => o.contactId === contactId);
}

// ── Call Events ───────────────────────────────────────────────────────────────

export async function getCallEvents(businessId: string) {
  return demoCallEvents;
}

// ── Estimates ─────────────────────────────────────────────────────────────────

export async function getEstimates(
  businessId: string,
  opts?: { status?: string }
) {
  if (opts?.status) {
    return demoEstimates.filter((e) => e.status === opts.status);
  }
  return demoEstimates;
}

// ── Templates ─────────────────────────────────────────────────────────────────

export async function getTemplates(businessId: string) {
  return demoTemplates;
}

// ── Campaigns ─────────────────────────────────────────────────────────────────

export async function getCampaigns(businessId: string) {
  return demoCampaigns;
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function getMessagesForOpportunity(opportunityId: string) {
  return demoMessages.filter((m) => m.opportunityId === opportunityId);
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function getBookings(businessId: string) {
  return demoBookings;
}

// ── Activity Logs ─────────────────────────────────────────────────────────────

export async function getActivityLogs(businessId: string, limit = 20) {
  return demoActivityLogs.slice(0, limit);
}

// ── Report Snapshots ──────────────────────────────────────────────────────────

export async function getReportSnapshots(businessId: string) {
  return demoReportSnapshots;
}

export async function getDashboardSummary(businessId: string) {
  return dashboardSummary;
}

// ── Integrations ──────────────────────────────────────────────────────────────

export async function getIntegrations(businessId: string) {
  return demoIntegrations;
}

// ── Alerts ────────────────────────────────────────────────────────────────────

export async function getAlerts(businessId: string) {
  return demoAlerts;
}
