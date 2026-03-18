"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import type { WalkthroughStep } from "@/types/revenue";

interface DemoStatePlayerProps {
  steps: WalkthroughStep[];
  onStepChange?: (step: WalkthroughStep, index: number) => void;
}

export function DemoStatePlayer({ steps, onStepChange }: DemoStatePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (currentIndex >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onStepChange?.(steps[next], next);
    }, steps[currentIndex].duration ?? 3000);
    return () => clearTimeout(timer);
  }, [playing, currentIndex, steps, onStepChange]);

  function goToStep(index: number) {
    setCurrentIndex(index);
    onStepChange?.(steps[index], index);
  }

  function reset() {
    setPlaying(false);
    goToStep(0);
  }

  const current = steps[currentIndex];

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 space-y-4">
      <div className="bg-slate-50 rounded-lg p-4 min-h-24">
        <p className="text-xs text-slate-400 mb-1">Step {currentIndex + 1} of {steps.length}</p>
        <h3 className="font-semibold text-slate-900 mb-1">{current.title}</h3>
        <p className="text-sm text-slate-600">{current.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={reset} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <RotateCcw className="h-4 w-4 text-slate-500" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          onClick={() => currentIndex < steps.length - 1 && goToStep(currentIndex + 1)}
          disabled={currentIndex >= steps.length - 1}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40"
        >
          <SkipForward className="h-4 w-4 text-slate-500" />
        </button>

        <div className="flex-1 flex items-center gap-1 ml-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "bg-blue-600 flex-1" : "bg-slate-200 w-4"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
