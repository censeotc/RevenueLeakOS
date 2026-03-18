import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { UserRole } from "@/types/revenue";

export function RoleGuard({ allowedRoles, role, children }: { allowedRoles: UserRole[]; role: UserRole; children: ReactNode }) {
  if (!allowedRoles.includes(role)) {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-slate-600">
          Your current role does not have access to this area yet.
        </CardContent>
      </Card>
    );
  }
  return <>{children}</>;
}
