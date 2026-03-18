"use client";

import { useState, useEffect } from "react";

interface Business {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  industry?: string | null;
  timezone: string;
  isDemo: boolean;
}

const DEMO_BUSINESS: Business = {
  id: "demo",
  name: "Demo HVAC Pros",
  slug: "demo-hvac-pros",
  phone: "+15550001234",
  industry: "HVAC",
  timezone: "America/Chicago",
  isDemo: true,
};

export function useCurrentBusiness() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch from session / API
    // For now, return demo business
    setBusiness(DEMO_BUSINESS);
    setLoading(false);
  }, []);

  return { business, loading };
}
