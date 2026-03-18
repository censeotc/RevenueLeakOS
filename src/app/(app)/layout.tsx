import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar userRole={(session.user as any).role} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar user={session.user} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
