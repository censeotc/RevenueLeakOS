import { DollarSign, TrendingUp, BarChart2, Users } from "lucide-react";

const summaryData = [
  { label: "Total Recovered (30d)", value: "$12,840", change: "+18%", icon: DollarSign, color: "text-green-600 bg-green-50" },
  { label: "Direct Attribution", value: "$8,200", change: "64%", icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
  { label: "Influenced Revenue", value: "$4,640", change: "36%", icon: BarChart2, color: "text-purple-600 bg-purple-50" },
  { label: "Contacts Reactivated", value: "14", change: "+3 this week", icon: Users, color: "text-orange-600 bg-orange-50" },
];

export function RevenueSummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item) => (
        <div key={item.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
            <item.icon className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{item.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">{item.change}</p>
        </div>
      ))}
    </div>
  );
}
