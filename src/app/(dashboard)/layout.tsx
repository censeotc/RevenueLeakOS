import type { ReactNode } from "react";

import { AppLayout } from "@/components/app-shell/AppLayout";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return <AppLayout role={session?.user.role ?? 'readonly'} userName={session?.user.name ?? 'Operator'}>{children}</AppLayout>;
}
