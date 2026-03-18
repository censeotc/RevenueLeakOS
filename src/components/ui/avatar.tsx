import * as React from "react";

import { cn } from "@/lib/utils";

function Avatar({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white", className)}>{children}</div>;
}

export { Avatar };
