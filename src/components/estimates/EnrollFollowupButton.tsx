"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle } from "lucide-react";

interface EnrollFollowupButtonProps {
  estimateId: string;
  alreadyEnrolled?: boolean;
}

export function EnrollFollowupButton({ estimateId, alreadyEnrolled = false }: EnrollFollowupButtonProps) {
  const [enrolled, setEnrolled] = useState(alreadyEnrolled);
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setEnrolled(true);
    setLoading(false);
  }

  if (enrolled) {
    return (
      <span className="flex items-center gap-1.5 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        Enrolled in follow-up
      </span>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      <PlayCircle className="h-3.5 w-3.5" />
      {loading ? "Enrolling..." : "Enroll in follow-up"}
    </button>
  );
}
