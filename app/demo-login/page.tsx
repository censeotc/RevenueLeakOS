import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { DemoLoginCard } from "@/components/demo-login-card";
import { authOptions } from "@/lib/auth";

export default async function DemoLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/app/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <DemoLoginCard />
    </main>
  );
}
