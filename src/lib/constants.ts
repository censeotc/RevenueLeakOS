export const APP_NAME = "RevenueLeak OS";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PRICING: "/pricing",
  DEMO: "/demo",
  AUDIT: "/revenue-leakage-audit",
  ABOUT: "/about",
  CONTACT: "/contact",

  ONBOARDING_BUSINESS_PROFILE: "/business-profile",
  ONBOARDING_CONNECT_DATA: "/connect-data",
  ONBOARDING_CHOOSE_WORKFLOWS: "/choose-workflows",
  ONBOARDING_LAUNCH: "/launch",

  DASHBOARD: "/app/dashboard",
  OPPORTUNITIES: "/app/opportunities",
  CALLS: "/app/calls",
  ESTIMATES: "/app/estimates",
  REACTIVATION: "/app/reactivation",
  CAMPAIGNS: "/app/campaigns",
  CONTACTS: "/app/contacts",
  REPORTS: "/app/reports",
  TEMPLATES: "/app/templates",
  INTEGRATIONS: "/app/integrations",
  SETTINGS: "/app/settings",
  DEMO_WALKTHROUGH: "/app/demo-walkthrough",
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Opportunities", href: ROUTES.OPPORTUNITIES, icon: "Target" },
  { label: "Calls", href: ROUTES.CALLS, icon: "Phone" },
  { label: "Estimates", href: ROUTES.ESTIMATES, icon: "FileText" },
  { label: "Reactivation", href: ROUTES.REACTIVATION, icon: "UserCheck" },
  { label: "Campaigns", href: ROUTES.CAMPAIGNS, icon: "Megaphone" },
  { label: "Contacts", href: ROUTES.CONTACTS, icon: "Users" },
  { label: "Reports", href: ROUTES.REPORTS, icon: "BarChart3" },
  { label: "Templates", href: ROUTES.TEMPLATES, icon: "FileCode" },
  { label: "Integrations", href: ROUTES.INTEGRATIONS, icon: "Plug" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
] as const;

export const ONBOARDING_STEPS = [
  { label: "Business Profile", href: ROUTES.ONBOARDING_BUSINESS_PROFILE },
  { label: "Connect Data", href: ROUTES.ONBOARDING_CONNECT_DATA },
  { label: "Choose Workflows", href: ROUTES.ONBOARDING_CHOOSE_WORKFLOWS },
  { label: "Launch", href: ROUTES.ONBOARDING_LAUNCH },
] as const;
