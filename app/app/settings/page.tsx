import { SectionHeader } from "@/components/section-header";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUser } from "@/lib/session";
import { getSettingsData } from "@/lib/services/revenueleak";
import { createUserAction, updateBusinessSettingsAction } from "@/app/actions";

export default async function SettingsPage() {
  const user = await getSessionUser();
  const data = await getSettingsData(user.businessId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        description="Business profile, users, permissions, messaging, attribution, compliance, notifications, and billing."
      />

      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateBusinessSettingsAction} className="grid gap-2 md:grid-cols-2">
            <Input name="timezone" defaultValue={data.business.timezone} />
            <Input
              name="staleEstimateDays"
              type="number"
              defaultValue={data.business.staleEstimateDays}
            />
            <Input
              name="attributionWindowDays"
              type="number"
              defaultValue={data.business.attributionWindowDays}
            />
            <Input
              name="highValueThreshold"
              type="number"
              defaultValue={data.business.highValueThreshold}
            />
            <Input
              name="duplicateMissedCallSuppressionHours"
              type="number"
              defaultValue={data.business.duplicateMissedCallSuppressionHours}
            />
            <SubmitButton pendingLabel="Saving...">Save settings</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? "success" : "destructive"}>
                      {member.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <form action={createUserAction} className="grid gap-2 rounded-md border border-slate-200 p-3 md:grid-cols-4">
            <Input name="name" placeholder="Name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Select name="role" defaultValue="csr">
              <option value="owner">owner</option>
              <option value="manager">manager</option>
              <option value="csr">csr</option>
              <option value="readonly">readonly</option>
            </Select>
            <Input name="password" type="text" defaultValue="TempPass123!" />
            <SubmitButton pendingLabel="Adding...">Add user</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          "Permissions",
          "Messaging",
          "Attribution Rules",
          "Compliance",
          "Notifications",
          "Billing",
        ].map((section) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{section}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                {section} controls are scaffolded in MVP and ready for deeper policy/configuration wiring.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
