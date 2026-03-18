export const APP_BASE_PATH = "/app";

export const INTERNAL_ROUTE_PATHS = {
  dashboard: "/dashboard",
  opportunities: "/opportunities",
  calls: "/calls",
  estimates: "/estimates",
  reactivation: "/reactivation",
  reports: "/reports",
  contacts: "/contacts",
  campaigns: "/campaigns",
  templates: "/templates",
  integrations: "/integrations",
  settings: "/settings",
  imports: "/imports",
  walkthrough: "/walkthrough",
  unauthorized: "/unauthorized",
} as const;

export type InternalRoutePath =
  (typeof INTERNAL_ROUTE_PATHS)[keyof typeof INTERNAL_ROUTE_PATHS];

export function toAppRoute(path: string) {
  if (path === "/") {
    return APP_BASE_PATH;
  }

  if (path.startsWith(APP_BASE_PATH)) {
    return path;
  }

  return `${APP_BASE_PATH}${path}`;
}

export function stripAppPrefix(pathname: string) {
  if (!pathname.startsWith(APP_BASE_PATH)) {
    return pathname;
  }

  const stripped = pathname.slice(APP_BASE_PATH.length);
  return stripped || INTERNAL_ROUTE_PATHS.dashboard;
}

const INTERNAL_PATHS: string[] = Object.values(INTERNAL_ROUTE_PATHS) as string[];

export function isInternalPath(pathname: string) {
  if (INTERNAL_PATHS.includes(pathname)) {
    return true;
  }

  for (let i = 0; i < INTERNAL_PATHS.length; i += 1) {
    const internalPath = INTERNAL_PATHS[i];
    if (pathname.startsWith(`${internalPath}/`)) {
      return true;
    }
  }

  return false;
}
