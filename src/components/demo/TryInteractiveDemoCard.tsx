import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TryInteractiveDemoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Try the interactive demo</CardTitle>
        <CardDescription>Jump into the dashboard walkthrough to preview the end-to-end operator journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/app/demo-walkthrough"><Button>Open product walkthrough</Button></Link>
      </CardContent>
    </Card>
  );
}
