export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/20 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-bold">RevenueLeak OS</span>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {/* Sidebar nav rendered by AppSidebar component */}
          </nav>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b px-6">
          {/* Topbar rendered by AppTopbar component */}
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
