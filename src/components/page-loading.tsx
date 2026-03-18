export function PageLoading({
  title = "Loading internal workspace",
  description = "Preparing seeded demo data and internal navigation.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="mt-3 h-10 w-96 max-w-full animate-pulse rounded bg-zinc-200" />
        <div className="mt-3 h-4 w-[32rem] max-w-full animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
            <div className="mt-4 h-8 w-36 animate-pulse rounded bg-zinc-100" />
            <div className="mt-4 h-3 w-full animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-zinc-900">{title}</p>
        <p className="mt-2 text-sm text-zinc-500">{description}</p>
      </div>
    </div>
  );
}
