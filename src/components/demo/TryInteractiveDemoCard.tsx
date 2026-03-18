import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TryInteractiveDemoCard() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base">Try the Interactive Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Explore a fully loaded demo with sample data. See how revenue recovery workflows work in practice.
        </p>
        <Link
          href="/app/demo-walkthrough"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start Walkthrough
        </Link>
      </CardContent>
    </Card>
  );
}
