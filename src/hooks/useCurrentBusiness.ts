"use client";

import { useState, useEffect } from "react";

interface CurrentBusiness {
  id: string;
  name: string;
  industry: string;
}

export function useCurrentBusiness() {
  const [business, setBusiness] = useState<CurrentBusiness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBusiness({
      id: "demo-business",
      name: "Comfort Air HVAC",
      industry: "home_services",
    });
    setLoading(false);
  }, []);

  return { business, loading };
}
