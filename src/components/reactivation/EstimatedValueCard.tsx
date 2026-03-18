import { TrendingUp } from "lucide-react";

interface EstimatedValueCardProps {
  value: number;
}

export function EstimatedValueCard({ value }: EstimatedValueCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <TrendingUp className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-xs text-blue-600 font-medium">Total Reactivation Opportunity</p>
        <p className="text-xl font-bold text-blue-700">${value.toLocaleString()}</p>
      </div>
    </div>
  );
}
