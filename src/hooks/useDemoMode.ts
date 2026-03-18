"use client";

import { useEffect, useState } from "react";

const DEMO_MODE_KEY = "revenueleak-demo-mode";

export function useDemoMode() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const savedValue = window.localStorage.getItem(DEMO_MODE_KEY);
    if (savedValue !== null) {
      setEnabled(savedValue === "true");
    }
  }, []);
  const toggle = () => {
    setEnabled((current) => {
      const nextValue = !current;
      window.localStorage.setItem(DEMO_MODE_KEY, String(nextValue));
      return nextValue;
    });
  };
  return { enabled, toggle };
}
