"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

type ToastRecord = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastRecord, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const pushToast = useCallback((toast: Omit<ToastRecord, "id">) => {
    const nextToast = { ...toast, id: Date.now() + Math.round(Math.random() * 1000) };
    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== nextToast.id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-xl border bg-white p-4 shadow-lg",
              toast.tone === "success" && "border-emerald-200",
              toast.tone === "error" && "border-red-200",
              toast.tone === "info" && "border-sky-200",
            )}
          >
            <p className="text-sm font-semibold text-zinc-950">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-sm text-zinc-500">{toast.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);

  if (!value) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return value;
}
