import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down" | "neutral";
  subtext?: string;
}

export function KpiCard({ label, value, change, changeDirection, subtext }: KpiCardProps) {
  const trendIcon = {
    up: <TrendingUp className="h-3.5 w-3.5" />,
    down: <TrendingDown className="h-3.5 w-3.5" />,
    neutral: <Minus className="h-3.5 w-3.5" />,
  }[changeDirection];

  const trendColor = {
    up: "text-green-600",
    down: "text-red-500",
    neutral: "text-slate-400",
  }[changeDirection];

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <div className={`flex items-center gap-1 text-xs mt-1 ${trendColor}`}>
        {trendIcon}
        <span>{change}</span>
        {subtext && <span className="text-slate-400 ml-1">{subtext}</span>}
      </div>
    </div>
  );
}
