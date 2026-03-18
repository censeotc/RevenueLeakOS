import type { NavItem, UserRole } from "@/lib/domain/types";

export const appNavItems: NavItem[] = [
  { title: "Dashboard", href: "/app/dashboard", roles: ["owner", "manager", "csr", "readonly"] },
  { title: "Opportunities", href: "/app/opportunities", roles: ["owner", "manager", "csr"] },
  { title: "Calls", href: "/app/calls", roles: ["owner", "manager", "csr"] },
  { title: "Estimates", href: "/app/estimates", roles: ["owner", "manager", "csr"] },
  { title: "Reactivation", href: "/app/reactivation", roles: ["owner", "manager"] },
  { title: "Campaigns", href: "/app/campaigns", roles: ["owner", "manager"] },
  { title: "Contacts", href: "/app/contacts", roles: ["owner", "manager", "csr"] },
  { title: "Reports", href: "/app/reports", roles: ["owner", "manager", "readonly"] },
  { title: "Templates", href: "/app/templates", roles: ["owner", "manager"] },
  { title: "Integrations", href: "/app/integrations", roles: ["owner", "manager"] },
  { title: "Settings", href: "/app/settings", roles: ["owner", "manager"] },
  { title: "Demo Walkthrough", href: "/app/demo-walkthrough", roles: ["owner", "manager", "csr", "readonly"] },
];

const readonlyRoutes = new Set(["/app/dashboard", "/app/reports", "/app/demo-walkthrough"]);

export function canAccessPath(role: UserRole, pathname: string) {
  if (role === "owner") return true;
  if (role === "readonly") {
    return readonlyRoutes.has(pathname);
  }

  const matched = appNavItems.find((item) => pathname.startsWith(item.href));
  return matched ? matched.roles.includes(role) : true;
}

export function getNavForRole(role: UserRole) {
  return appNavItems.filter((item) => item.roles.includes(role));
}
