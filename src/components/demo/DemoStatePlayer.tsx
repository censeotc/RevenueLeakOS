"use client";

import { useState, useEffect } from "react";

interface DemoState {
  label: string;
  data: Record<string, unknown>;
}

interface DemoStatePlayerProps {
  states: DemoState[];
  autoPlay?: boolean;
  intervalMs?: number;
}

export function DemoStatePlayer({ states, autoPlay = false, intervalMs = 3000 }: DemoStatePlayerProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % states.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [playing, states.length, intervalMs]);

  const current = states[index];

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{current?.label ?? "Demo"}</h3>
        <button
          onClick={() => setPlaying(!playing)}
          className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      <div className="rounded-md bg-muted p-4 text-xs font-mono">
        <pre>{JSON.stringify(current?.data, null, 2)}</pre>
      </div>
      <div className="flex items-center gap-2">
        {states.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-primary" : "bg-muted-foreground/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
