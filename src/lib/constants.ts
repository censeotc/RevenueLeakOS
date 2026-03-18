import type { NavItem } from "@/types/revenue";

export const APP_NAME = "RevenueLeak OS";
export const MARKETING_NAV: NavItem[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/demo" },
  { label: "Audit", href: "/revenue-leakage-audit" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];
export const APP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", description: "Executive recovery snapshot" },
  { label: "Opportunities", href: "/app/opportunities", description: "Triage active leaks" },
  { label: "Calls", href: "/app/calls", description: "Review missed calls and SMS" },
  { label: "Estimates", href: "/app/estimates", description: "Re-engage stale quotes" },
  { label: "Reactivation", href: "/app/reactivation", description: "Win back dormant customers" },
  { label: "Campaigns", href: "/app/campaigns", description: "Launch workflow sequences" },
  { label: "Contacts", href: "/app/contacts", description: "Manage imported audiences" },
  { label: "Reports", href: "/app/reports", description: "Measure direct and influenced revenue" },
  { label: "Templates", href: "/app/templates", description: "Author reusable scripts" },
  { label: "Integrations", href: "/app/integrations", description: "Connect systems of record" },
  { label: "Settings", href: "/app/settings", description: "Business, users, notifications" },
  { label: "Demo Walkthrough", href: "/app/demo-walkthrough", description: "Play through the product story" }
];
export const PRICING_TIERS = [
  { name: "Launch", price: "$499/mo", description: "For single-location operators validating recovery workflows.", features: ["Missed call capture", "Estimate follow-up", "Weekly revenue report"] },
  { name: "Scale", price: "$1,200/mo", description: "For multi-workflow teams coordinating CSRs, sales, and operations.", features: ["Workflow orchestration", "Role-based dashboards", "Campaign builder"] },
  { name: "Enterprise", price: "Custom", description: "For multi-location brands rolling up influenced revenue and governance.", features: ["Multi-branch reporting", "Custom integrations", "Strategic onboarding"] }
] as const;
export const ONBOARDING_STEPS = [
  { label: "Business profile", href: "/business-profile" },
  { label: "Connect data", href: "/connect-data" },
  { label: "Choose workflows", href: "/choose-workflows" },
  { label: "Launch", href: "/launch" }
] as const;
export const WORKFLOW_CATALOG = ["Missed call recovery", "Estimate rescue", "Dormant customer reactivation", "Membership renewal nudges"] as const;
export const INTEGRATION_CATALOG = ["Twilio", "Jobber", "Housecall Pro", "ServiceTitan", "CSV import"] as const;
