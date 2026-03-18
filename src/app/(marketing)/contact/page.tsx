import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <MarketingShell eyebrow="Contact" title="Talk through your workflow mix, data sources, and revenue goals." description="Use the contact page to open a discovery conversation around onboarding, integrations, and team rollout.">
      <Card className="max-w-3xl border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-white">Contact the team</CardTitle>
          <CardDescription className="text-slate-300">Share your service lines, locations, and current systems of record.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Name" />
          <Input placeholder="Email" />
          <Input placeholder="Company" />
          <Input placeholder="Phone" />
          <div className="md:col-span-2"><Textarea placeholder="How can we help?" /></div>
          <div className="md:col-span-2"><Button>Send inquiry</Button></div>
        </CardContent>
      </Card>
    </MarketingShell>
  );
}
