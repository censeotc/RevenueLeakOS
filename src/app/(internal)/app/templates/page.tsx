import Link from "next/link";

import { archiveTemplateAction, duplicateTemplateAction } from "@/app/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatusBadge } from "@/components/app-shell/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getTemplates } from "@/lib/data/selectors";

export const dynamic = "force-dynamic";

const categories = ["all", "missed_call", "estimate_rescue", "reactivation"];

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; id?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const templates = getTemplates(category);
  const selected = templates.find((template) => template.id === params.id) ?? templates[0];

  return (
    <>
      <PageHeader
        eyebrow="Messaging library"
        title="Templates"
        description="Manage message templates with category filters, variable pickers, previews, duplicate actions, and archive controls."
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <Button key={item} asChild variant={item === category ? "default" : "outline"} size="sm">
            <Link href={`/app/templates?category=${item}`}>{item.replace(/_/g, " ")}</Link>
          </Button>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Template list</CardTitle>
            <CardDescription>Category-scoped message assets for all workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/app/templates?category=${category}&id=${template.id}`}
                className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{template.name}</p>
                    <p className="text-sm text-slate-500">{template.category.replace(/_/g, " ")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={template.channel} />
                    {template.isArchived ? <StatusBadge value="archived" /> : null}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {selected ? (
          <Card>
            <CardHeader>
              <CardTitle>Template editor</CardTitle>
              <CardDescription>Preview copy, variables, duplicate, and archive state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selected.variables.map((variable) => (
                  <Badge key={variable}>{`{{${variable}}}`}</Badge>
                ))}
              </div>
              {selected.subject ? (
                <div className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="text-slate-500">Subject</p>
                  <p className="font-medium text-slate-900">{selected.subject}</p>
                </div>
              ) : null}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Preview</p>
                <Textarea readOnly value={selected.body} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <form action={duplicateTemplateAction}>
                  <input type="hidden" name="templateId" value={selected.id} />
                  <Button className="w-full" type="submit" variant="outline">
                    Duplicate template
                  </Button>
                </form>
                <form action={archiveTemplateAction}>
                  <input type="hidden" name="templateId" value={selected.id} />
                  <Button className="w-full" type="submit" variant="danger">
                    Archive template
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </>
  );
}
