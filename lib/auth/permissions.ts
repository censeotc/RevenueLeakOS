import { UserRoleValue } from "@/lib/domain/types";

type RoutePermission = {
  pathPrefix: string;
  allowedRoles: UserRoleValue[];
};

const permissionMatrix: RoutePermission[] = [
  {
    pathPrefix: "/app/dashboard",
    allowedRoles: ["owner", "manager", "csr", "readonly"],
  },
  {
    pathPrefix: "/app/reports",
    allowedRoles: ["owner", "manager", "readonly"],
  },
  {
    pathPrefix: "/app/opportunities",
    allowedRoles: ["owner", "manager", "csr"],
  },
  {
    pathPrefix: "/app/calls",
    allowedRoles: ["owner", "manager", "csr"],
  },
  {
    pathPrefix: "/app/estimates",
    allowedRoles: ["owner", "manager", "csr"],
  },
  {
    pathPrefix: "/app/reactivation",
    allowedRoles: ["owner", "manager"],
  },
  {
    pathPrefix: "/app/campaigns",
    allowedRoles: ["owner", "manager"],
  },
  {
    pathPrefix: "/app/contacts",
    allowedRoles: ["owner", "manager", "csr"],
  },
  {
    pathPrefix: "/app/templates",
    allowedRoles: ["owner", "manager"],
  },
  {
    pathPrefix: "/app/integrations",
    allowedRoles: ["owner", "manager"],
  },
  {
    pathPrefix: "/app/settings",
    allowedRoles: ["owner"],
  },
  {
    pathPrefix: "/app/demo-walkthrough",
    allowedRoles: ["owner", "manager", "csr", "readonly"],
  },
];

export function canAccessPath(pathname: string, role: UserRoleValue) {
  const match = permissionMatrix.find((rule) =>
    pathname.startsWith(rule.pathPrefix),
  );

  if (!match) {
    return true;
  }

  return match.allowedRoles.includes(role);
}

export function visibleNavForRole(role: UserRoleValue) {
  return permissionMatrix
    .filter((rule) => rule.allowedRoles.includes(role))
    .map((rule) => rule.pathPrefix);
}
