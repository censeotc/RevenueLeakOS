import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <MarketingShell eyebrow="About" title="RevenueLeak OS was designed around operational proof, not marketing vanity metrics." description="The platform structure reflects how revenue recovery teams actually work: identify, engage, escalate, and attribute.">
      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ['Operator first', 'Pages, components, and workflows are organized around the daily motion of CSRs and managers.'],
          ['Attribution ready', 'Reports separate direct from influenced revenue so programs can be defended with finance and leadership.'],
          ['Extensible foundation', 'Prisma models, validators, services, and route groups create a foundation for deeper integration work.'],
        ].map(([title, description]) => (
          <Card className="border-white/10 bg-white/5 text-white" key={title}>
            <CardHeader>
              <CardTitle className="text-white">{title}</CardTitle>
              <CardDescription className="text-slate-300">{description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-200">This branch focuses on application structure so delivery teams can iterate inside stable product boundaries.</CardContent>
          </Card>
        ))}
      </section>
    </MarketingShell>
  );
}
