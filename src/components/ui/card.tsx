import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("flex items-center justify-between border-b border-border p-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return <h3 className={cn("text-sm font-semibold text-foreground", className)}>{children}</h3>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
