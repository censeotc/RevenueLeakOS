import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RevenueLeakageAuditPage() {
  return (
    <MarketingShell eyebrow="Audit" title="Start a revenue leakage audit." description="Capture the current state of missed calls, stale estimates, and dormant customers so the onboarding workflow can be tailored to your operation.">
      <Card className="max-w-3xl border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-white">Audit intake</CardTitle>
          <CardDescription className="text-slate-300">Use this form to outline your call volume, quote process, and current follow-up gaps.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Business name" />
          <Input placeholder="Primary contact" />
          <Input placeholder="Monthly call volume" />
          <Input placeholder="Quotes sent per month" />
          <div className="md:col-span-2">
            <Textarea placeholder="Describe the biggest revenue leakage problems you want to solve." />
          </div>
          <div className="md:col-span-2"><Button>Submit audit request</Button></div>
        </CardContent>
      </Card>
    </MarketingShell>
  );
}
