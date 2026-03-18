"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemoStateFrame } from "@/types/revenue";

export function DemoStatePlayer({ frames }: { frames: DemoStateFrame[] }) {
  const [index, setIndex] = useState(0);
  const frame = frames[index];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{frame.title}</CardTitle>
        <CardDescription>{frame.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm text-brand-700">{frame.highlight}</div>
        <div className="flex gap-3">
          <Button disabled={index === 0} onClick={() => setIndex((current) => Math.max(current - 1, 0))} variant="outline">Previous</Button>
          <Button disabled={index === frames.length - 1} onClick={() => setIndex((current) => Math.min(current + 1, frames.length - 1))}>Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}
