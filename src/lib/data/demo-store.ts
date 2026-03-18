import { buildDemoTenantData } from "@/lib/demo/build-demo-tenant";
import type { DemoTenantData } from "@/lib/domain/types";

declare global {
  var __revenueLeakStore: DemoTenantData | undefined;
}

function initializeStore() {
  return buildDemoTenantData();
}

export function getDemoStore() {
  if (!global.__revenueLeakStore) {
    global.__revenueLeakStore = initializeStore();
  }

  return global.__revenueLeakStore;
}

export function mutateDemoStore(mutator: (draft: DemoTenantData) => void) {
  const store = getDemoStore();
  mutator(store);
  return store;
}

export function resetDemoStore() {
  global.__revenueLeakStore = initializeStore();
  return global.__revenueLeakStore;
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
