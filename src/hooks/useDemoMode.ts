"use client";

import { useState, useCallback } from "react";

export function useDemoMode() {
  const [isDemoActive, setIsDemoActive] = useState(true);

  const enableDemo = useCallback(() => setIsDemoActive(true), []);
  const disableDemo = useCallback(() => setIsDemoActive(false), []);

  return { isDemoActive, enableDemo, disableDemo };
}
