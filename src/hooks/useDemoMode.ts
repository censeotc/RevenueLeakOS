"use client";

import { useState, useCallback } from "react";

export function useDemoMode() {
  const isDemoMode =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    (typeof window !== "undefined" && window.location.pathname.startsWith("/app/demo"));

  const [demoBanner, setDemoBanner] = useState(isDemoMode);

  const dismissBanner = useCallback(() => {
    setDemoBanner(false);
  }, []);

  return {
    isDemoMode,
    demoBanner,
    dismissBanner,
  };
}
