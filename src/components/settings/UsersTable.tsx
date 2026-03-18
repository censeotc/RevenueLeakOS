import { DataTable } from "@/components/shared/DataTable";
import type { UserRecord } from "@/types/revenue";

export function UsersTable({ users }: { users: UserRecord[] }) {
  return <DataTable title="Users" description="Operators and managers with workspace access." columns={["Name", "Email", "Role", "Status"]} rows={users.map((user) => [user.name, user.email, user.role, user.status])} />;
}
