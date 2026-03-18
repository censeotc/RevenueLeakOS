"use client";

interface EnrollFollowupButtonProps {
  estimateId: string;
  onEnroll?: (estimateId: string) => void;
}

export function EnrollFollowupButton({ estimateId, onEnroll }: EnrollFollowupButtonProps) {
  return (
    <button
      onClick={() => onEnroll?.(estimateId)}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Enroll in Follow-Up
    </button>
  );
}
