import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create your workspace</CardTitle>
          <CardDescription>Provision the first owner account and start the onboarding flow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="First name" />
          <Input placeholder="Last name" />
          <Input className="md:col-span-2" placeholder="Work email" type="email" />
          <Input placeholder="Company" />
          <Input placeholder="Phone" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Confirm password" type="password" />
          <div className="md:col-span-2">
            <Button className="w-full">Create account</Button>
            <p className="mt-3 text-sm text-slate-500">Already have access? <Link href="/login">Log in</Link>.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
