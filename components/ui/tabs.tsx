"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const activeValue = value ?? internalValue;
  const setValue = (nextValue: string) => {
    if (onValueChange) {
      onValueChange(nextValue);
      return;
    }
    setInternalValue(nextValue);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, setValue }}>
      <div className={cn("space-y-3", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("inline-flex h-10 items-center rounded-lg bg-slate-100 p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used inside Tabs");
  }
  const isActive = context.value === value;
  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium",
        isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600",
        className,
      )}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(TabsContext);
  if (!context || context.value !== value) {
    return null;
  }
  return <div className={cn(className)}>{children}</div>;
}
