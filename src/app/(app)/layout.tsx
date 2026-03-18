import { Sidebar } from "@/components/layout/sidebar";
import { PilotDataProvider } from "@/components/providers/pilot-data-provider";
import { requirePilotSession } from "@/lib/demo-session";
import { getPilotDataSnapshot } from "@/services/pilot-data";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePilotSession();
  const initialData = await getPilotDataSnapshot(session.businessId);

  return (
    <PilotDataProvider session={session} initialData={initialData}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50/50">{children}</main>
      </div>
    </PilotDataProvider>
  );
}
