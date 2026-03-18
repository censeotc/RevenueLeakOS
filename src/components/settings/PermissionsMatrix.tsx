import { DataTable } from "@/components/shared/DataTable";
import type { PermissionMatrixRow } from "@/types/revenue";

const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

export function PermissionsMatrix({ rows }: { rows: PermissionMatrixRow[] }) {
  return <DataTable title="Permissions matrix" description="Role capabilities across the application shell." columns={["Capability", "Owner", "Manager", "CSR", "Readonly"]} rows={rows.map((row) => [row.capability, yesNo(row.owner), yesNo(row.manager), yesNo(row.csr), yesNo(row.readonly)])} />;
}
