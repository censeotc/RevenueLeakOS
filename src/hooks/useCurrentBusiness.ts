"use client";

import { useMemo } from "react";
import { businessProfile } from "@/data/demoData";

export function useCurrentBusiness() {
  return useMemo(() => businessProfile, []);
}
