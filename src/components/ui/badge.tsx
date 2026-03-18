import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-primary/10 text-primary": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-destructive/10 text-destructive": variant === "destructive",
          "border border-border text-foreground": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-orange-100 text-orange-800",
    responded: "bg-purple-100 text-purple-800",
    booked: "bg-green-100 text-green-800",
    won: "bg-emerald-100 text-emerald-800",
    lost: "bg-red-100 text-red-800",
    closed: "bg-gray-100 text-gray-800",
    missed: "bg-red-100 text-red-800",
    after_hours: "bg-amber-100 text-amber-800",
    abandoned: "bg-orange-100 text-orange-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-cyan-100 text-cyan-800",
    stale: "bg-amber-100 text-amber-800",
    follow_up: "bg-purple-100 text-purple-800",
    expired: "bg-gray-100 text-gray-800",
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    connected: "bg-green-100 text-green-800",
    disconnected: "bg-gray-100 text-gray-800",
    error: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    scheduled: "bg-blue-100 text-blue-800",
  };

  const color = colorMap[status] || "bg-gray-100 text-gray-800";
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", color)}>
      {label}
    </span>
  );
}
