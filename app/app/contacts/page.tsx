import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSessionUser } from "@/lib/session";
import { getContacts } from "@/lib/services/revenueleak";

export default async function ContactsPage() {
  const user = await getSessionUser();
  const contacts = await getContacts(user.businessId);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Contacts"
        description="Manage contacts, tags, notes, and linked opportunities."
      />

      <Card>
        <CardHeader>
          <CardTitle>CSV import scaffold</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-2 md:grid-cols-[1fr_auto]">
            <Input type="file" accept=".csv" disabled />
            <Button type="button" variant="outline" disabled>
              Import CSV (scaffold)
            </Button>
          </form>
          <p className="mt-2 text-xs text-slate-500">
            CSV parser wiring is intentionally scaffolded and ready for connector implementation.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Linked opportunities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.email ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-slate-600">
                    {contact.notes ?? "—"}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contact.opportunities.length === 0 ? (
                        <span className="text-xs text-slate-500">No opportunities</span>
                      ) : (
                        contact.opportunities.map((opp) => (
                          <p key={opp.id} className="text-xs text-slate-700">
                            {opp.type.replace("_", " ")} • {opp.status}
                          </p>
                        ))
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
