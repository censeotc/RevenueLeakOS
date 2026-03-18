import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, Target, Calendar, Clock, FileText, UserCheck,
  TrendingUp, TrendingDown, ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";
import { dashboardSummary, demoAlerts, demoActivityLogs, demoOpportunities, demoBookings } from "@/data/seed";
import { formatDistanceToNow } from "date-fns";
import { reportingService } from "@/services/reportingService";

const statCards = [
  { key: "revenueInfluenced" as const, label: "Revenue Influenced", icon: DollarSign, format: (v: number) => `$${v.toLocaleString()}`, color: "text-success-600 bg-success-50" },
  { key: "opportunitiesRecovered" as const, label: "Opportunities Recovered", icon: Target, format: (v: number) => String(v), color: "text-primary-600 bg-primary-50" },
  { key: "bookingsCreated" as const, label: "Bookings Created", icon: Calendar, format: (v: number) => String(v), color: "text-purple-600 bg-purple-50" },
  { key: "avgResponseMinutes" as const, label: "Avg Response Time", icon: Clock, format: (v: number) => `${v} min`, color: "text-amber-600 bg-amber-50" },
  { key: "estimatesReopened" as const, label: "Estimates Reopened", icon: FileText, format: (v: number) => String(v), color: "text-blue-600 bg-blue-50" },
  { key: "customersReactivated" as const, label: "Customers Reactivated", icon: UserCheck, format: (v: number) => String(v), color: "text-emerald-600 bg-emerald-50" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const trends = reportingService.getTrends();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const openOpps = demoOpportunities.filter((o) => !["won", "lost"].includes(o.status));
  const upcomingBookings = demoBookings
    .filter((b) => b.status === "scheduled")
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Last 30 days overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon: Icon, format, color }) => {
          const trendKey = key as keyof typeof trends;
          const trend = trends[trendKey];
          return (
            <Card key={key}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{format(dashboardSummary[key])}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
              </div>
              {trend !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  {trend >= 0 ? (
                    <TrendingUp size={14} className="text-success-500" />
                  ) : (
                    <TrendingDown size={14} className="text-danger-500" />
                  )}
                  <span className={`text-xs font-medium ${trend >= 0 ? "text-success-600" : "text-danger-600"}`}>
                    {trend >= 0 ? "+" : ""}{trend}% vs last period
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Open Opportunities</h2>
            <button
              onClick={() => navigate("/app/opportunities")}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {openOpps.slice(0, 6).map((opp) => (
              <div key={opp.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{opp.title}</p>
                  <p className="text-xs text-gray-500">{opp.type.replace("_", " ")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-gray-700">${opp.estimatedValue.toLocaleString()}</span>
                  <Badge variant={opp.status === "new" ? "warning" : "primary"}>{opp.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Upcoming Bookings</h2>
            <button
              onClick={() => navigate("/app/calls")}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {upcomingBookings.map((bk) => (
              <div key={bk.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{bk.title}</p>
                  <p className="text-xs text-gray-500">{bk.serviceType}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-gray-700">${bk.estimatedValue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{formatDistanceToNow(bk.scheduledAt, { addSuffix: true })}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Alerts</h2>
          </div>
          <div className="space-y-2">
            {demoAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => alert.linkTo && navigate(alert.linkTo)}
                className={`flex items-start gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-colors ${!alert.read ? "bg-primary-50/50 hover:bg-primary-50" : "hover:bg-gray-50"}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.description}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-2">
            {demoActivityLogs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700">{formatAction(log.action, log.metadata)}</p>
                  <p className="text-xs text-gray-400">{formatDistanceToNow(log.createdAt, { addSuffix: true })}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function formatAction(action: string, metadata: Record<string, unknown>): string {
  const parts = action.split(".");
  const entity = parts[0];
  const verb = parts[1];
  switch (action) {
    case "opportunity.created":
      return `New ${metadata.type} opportunity: ${metadata.contact}`;
    case "opportunity.won":
      return `Opportunity won: $${metadata.value} (${metadata.type})`;
    case "sms.sent":
      return `SMS sent: ${metadata.template}`;
    case "sms.received":
      return `SMS received from ${metadata.from}`;
    case "call.outbound":
      return `Outbound call (${metadata.duration}s)`;
    case "booking.created":
      return `Booking created: ${metadata.service} for ${metadata.contact}`;
    case "estimate.stale":
      return `Estimate going stale: $${metadata.amount} (${metadata.days} days)`;
    case "estimate.sent":
      return `Estimate sent: $${metadata.amount} to ${metadata.contact}`;
    case "campaign.launched":
      return `Campaign launched: ${metadata.name} (${metadata.targets} targets)`;
    default:
      return `${entity} ${verb}`;
  }
}
