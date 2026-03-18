import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PRICING_TIERS } from "@/lib/constants";

export default function PricingPage() {
  return (
    <MarketingShell eyebrow="Pricing" title="Flexible packages for operators, growth teams, and multi-location leaders." description="Choose the workflow depth and reporting sophistication that fits the stage of your revenue recovery program.">
      <section className="grid gap-6 lg:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <Card className="border-white/10 bg-white/5 text-white" key={tier.name}>
            <CardHeader>
              <CardTitle className="text-white">{tier.name}</CardTitle>
              <CardDescription className="text-slate-300">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-200">
              <p className="text-3xl font-semibold text-white">{tier.price}</p>
              <ul className="space-y-2">{tier.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </MarketingShell>
  );
}
