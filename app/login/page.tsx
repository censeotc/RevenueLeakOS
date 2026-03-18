import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LoginForm } from "@/components/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/app/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">RevenueLeak OS</h1>
          <p className="text-sm text-slate-600">Internal revenue recovery app</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
