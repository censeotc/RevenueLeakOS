import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BusinessProfile } from "@/types/revenue";

export function BusinessProfileForm({ profile }: { profile: BusinessProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business profile</CardTitle>
        <CardDescription>Core company settings and routing defaults.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Input defaultValue={profile.name} />
        <Input defaultValue={profile.phone} />
        <Input defaultValue={profile.website} />
        <Input defaultValue={profile.timezone} />
      </CardContent>
    </Card>
  );
}
