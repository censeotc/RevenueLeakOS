"use client";

import { useState } from "react";

const DEMO_MODE_KEY = "revenueleak-demo-mode";

export function useDemoMode() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const savedValue = window.localStorage.getItem(DEMO_MODE_KEY);
    return savedValue === null ? true : savedValue === "true";
  });
  const toggle = () => {
    setEnabled((current) => {
      const nextValue = !current;
      window.localStorage.setItem(DEMO_MODE_KEY, String(nextValue));
      return nextValue;
    });
  };
  return { enabled, toggle };
}
