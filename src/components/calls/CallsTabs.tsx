import { Card, CardContent } from "@/components/ui/card";

export function CallsTabs() {
  return (
    <Card>
      <CardContent className="flex flex-wrap gap-2 py-4">
        {['All calls', 'Missed', 'After-hours', 'Booked'].map((tab, index) => (
          <button className={`rounded-full px-3 py-2 text-sm ${index === 0 ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`} key={tab} type="button">
            {tab}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
