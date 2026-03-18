import {
  demoOpportunities,
  demoBookings,
  demoCallEvents,
  demoEstimates,
  demoMessages,
  demoReportSnapshots,
  demoContacts,
  demoCampaigns,
} from "@/lib/demo-data";
import { formatCurrency, formatMinutes } from "@/lib/utils";

export interface DashboardMetrics {
  revenueInfluenced: number;
  revenueRecovered: number;
  pipelineValue: number;
  opportunitiesActive: number;
  opportunitiesRecovered: number;
  bookingsCreated: number;
  avgResponseMinutes: number;
  estimatesReopened: number;
  customersReactivated: number;
  missedCallsHandled: number;
  conversionRate: number;
}

export interface WorkflowMetrics {
  name: string;
  type: string;
  opportunities: number;
  recovered: number;
  conversionRate: number;
  pipelineValue: number;
  recoveredValue: number;
}

export interface PeriodComparison {
  metric: string;
  current: number;
  previous: number;
  delta: number;
  deltaPercent: number;
  formatted: {
    current: string;
    previous: string;
  };
}

export interface CampaignMetrics {
  id: string;
  name: string;
  type: string;
  status: string;
  targetCount: number;
  sentCount: number;
  responseRate: number;
  bookingRate: number;
  estimatedROI: number;
}

class ReportingService {
  getDashboardMetrics(): DashboardMetrics {
    const activeOpps = demoOpportunities.filter(
      (o) => !["won", "lost", "closed"].includes(o.status)
    );
    const recoveredOpps = demoOpportunities.filter(
      (o) => ["won", "booked"].includes(o.status)
    );
    const missedCallOpps = demoOpportunities.filter(
      (o) => o.type === "missed_call"
    );
    const estimateOpps = demoOpportunities.filter(
      (o) => o.type === "estimate_rescue" && ["won", "booked", "responded", "in_progress"].includes(o.status)
    );
    const reactivationOpps = demoOpportunities.filter(
      (o) => o.type === "reactivation" && ["won", "booked"].includes(o.status)
    );

    const current = demoReportSnapshots[0];

    return {
      revenueInfluenced: current.revenueInfluenced,
      revenueRecovered: current.revenueRecovered,
      pipelineValue: activeOpps.reduce((sum, o) => sum + o.estimatedValue, 0),
      opportunitiesActive: activeOpps.length,
      opportunitiesRecovered: recoveredOpps.length,
      bookingsCreated: demoBookings.length,
      avgResponseMinutes: current.avgResponseMinutes,
      estimatesReopened: estimateOpps.length,
      customersReactivated: reactivationOpps.length,
      missedCallsHandled: missedCallOpps.length,
      conversionRate: current.conversionRate,
    };
  }

  getWorkflowMetrics(): WorkflowMetrics[] {
    const types = [
      { name: "Missed Call Recovery", type: "missed_call" },
      { name: "Estimate Rescue", type: "estimate_rescue" },
      { name: "Reactivation", type: "reactivation" },
    ];

    return types.map(({ name, type }) => {
      const opps = demoOpportunities.filter((o) => o.type === type);
      const recovered = opps.filter((o) => ["won", "booked"].includes(o.status));

      return {
        name,
        type,
        opportunities: opps.length,
        recovered: recovered.length,
        conversionRate: opps.length > 0 ? Math.round((recovered.length / opps.length) * 100) : 0,
        pipelineValue: opps.reduce((sum, o) => sum + o.estimatedValue, 0),
        recoveredValue: recovered.reduce((sum, o) => sum + (o.actualValue || 0), 0),
      };
    });
  }

  getPeriodComparison(): PeriodComparison[] {
    const current = demoReportSnapshots[0];
    const previous = demoReportSnapshots[1];

    const delta = (c: number, p: number) => c - p;
    const deltaPct = (c: number, p: number) => (p === 0 ? 0 : Math.round(((c - p) / p) * 100));

    return [
      {
        metric: "Revenue Influenced",
        current: current.revenueInfluenced,
        previous: previous.revenueInfluenced,
        delta: delta(current.revenueInfluenced, previous.revenueInfluenced),
        deltaPercent: deltaPct(current.revenueInfluenced, previous.revenueInfluenced),
        formatted: {
          current: formatCurrency(current.revenueInfluenced),
          previous: formatCurrency(previous.revenueInfluenced),
        },
      },
      {
        metric: "Revenue Recovered",
        current: current.revenueRecovered,
        previous: previous.revenueRecovered,
        delta: delta(current.revenueRecovered, previous.revenueRecovered),
        deltaPercent: deltaPct(current.revenueRecovered, previous.revenueRecovered),
        formatted: {
          current: formatCurrency(current.revenueRecovered),
          previous: formatCurrency(previous.revenueRecovered),
        },
      },
      {
        metric: "Opportunities Created",
        current: current.opportunitiesCreated,
        previous: previous.opportunitiesCreated,
        delta: delta(current.opportunitiesCreated, previous.opportunitiesCreated),
        deltaPercent: deltaPct(current.opportunitiesCreated, previous.opportunitiesCreated),
        formatted: {
          current: current.opportunitiesCreated.toString(),
          previous: previous.opportunitiesCreated.toString(),
        },
      },
      {
        metric: "Bookings Created",
        current: current.bookingsCreated,
        previous: previous.bookingsCreated,
        delta: delta(current.bookingsCreated, previous.bookingsCreated),
        deltaPercent: deltaPct(current.bookingsCreated, previous.bookingsCreated),
        formatted: {
          current: current.bookingsCreated.toString(),
          previous: previous.bookingsCreated.toString(),
        },
      },
      {
        metric: "Avg Response Time",
        current: current.avgResponseMinutes,
        previous: previous.avgResponseMinutes,
        delta: delta(previous.avgResponseMinutes, current.avgResponseMinutes),
        deltaPercent: deltaPct(previous.avgResponseMinutes, current.avgResponseMinutes),
        formatted: {
          current: formatMinutes(current.avgResponseMinutes),
          previous: formatMinutes(previous.avgResponseMinutes),
        },
      },
      {
        metric: "Conversion Rate",
        current: current.conversionRate,
        previous: previous.conversionRate,
        delta: delta(current.conversionRate, previous.conversionRate),
        deltaPercent: deltaPct(current.conversionRate, previous.conversionRate),
        formatted: {
          current: `${current.conversionRate}%`,
          previous: `${previous.conversionRate}%`,
        },
      },
    ];
  }

  getCampaignMetrics(): CampaignMetrics[] {
    return demoCampaigns.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      status: c.status,
      targetCount: c.targetCount,
      sentCount: c.sentCount,
      responseRate: c.sentCount > 0 ? Math.round((c.responseCount / c.sentCount) * 100) : 0,
      bookingRate: c.sentCount > 0 ? Math.round((c.bookedCount / c.sentCount) * 100) : 0,
      estimatedROI: c.bookedCount * 350,
    }));
  }

  getContactSegments() {
    const allContacts = demoContacts;
    const now = new Date();

    const dormant365 = allContacts.filter(
      (c) => c.lastServiceDate && now.getTime() - c.lastServiceDate.getTime() > 365 * 86400000
    );
    const dormant180 = allContacts.filter(
      (c) =>
        c.lastServiceDate &&
        now.getTime() - c.lastServiceDate.getTime() > 180 * 86400000 &&
        now.getTime() - c.lastServiceDate.getTime() <= 365 * 86400000
    );
    const highValue = allContacts.filter((c) => c.lifetimeValue >= 5000);
    const neverServiced = allContacts.filter((c) => !c.lastServiceDate);

    return [
      {
        name: "Dormant 12+ months",
        count: dormant365.length,
        totalValue: dormant365.reduce((s, c) => s + c.lifetimeValue, 0),
        avgValue: dormant365.length > 0 ? Math.round(dormant365.reduce((s, c) => s + c.lifetimeValue, 0) / dormant365.length) : 0,
      },
      {
        name: "Dormant 6-12 months",
        count: dormant180.length,
        totalValue: dormant180.reduce((s, c) => s + c.lifetimeValue, 0),
        avgValue: dormant180.length > 0 ? Math.round(dormant180.reduce((s, c) => s + c.lifetimeValue, 0) / dormant180.length) : 0,
      },
      {
        name: "High value (>$5k LTV)",
        count: highValue.length,
        totalValue: highValue.reduce((s, c) => s + c.lifetimeValue, 0),
        avgValue: highValue.length > 0 ? Math.round(highValue.reduce((s, c) => s + c.lifetimeValue, 0) / highValue.length) : 0,
      },
      {
        name: "Never serviced",
        count: neverServiced.length,
        totalValue: 0,
        avgValue: 0,
      },
    ];
  }

  getCallAnalytics() {
    const calls = demoCallEvents;
    const missed = calls.filter((c) => c.status === "missed");
    const afterHours = calls.filter((c) => c.status === "after_hours");
    const responded = calls.filter((c) => c.status === "responded");
    const booked = calls.filter((c) => c.status === "booked");

    return {
      totalCalls: calls.length,
      missedCalls: missed.length,
      afterHoursCalls: afterHours.length,
      respondedCalls: responded.length,
      bookedCalls: booked.length,
      missRate: calls.length > 0 ? Math.round((missed.length / calls.length) * 100) : 0,
      recoveryRate: missed.length > 0
        ? Math.round(
            (missed.filter((c) => c.opportunityId).length / missed.length) * 100
          )
        : 0,
    };
  }

  getEstimateAnalytics() {
    const estimates = demoEstimates;
    const stale = estimates.filter((e) => e.status === "stale");
    const booked = estimates.filter((e) => e.status === "booked");
    const totalValue = estimates.reduce((s, e) => s + e.amount, 0);
    const staleValue = stale.reduce((s, e) => s + e.amount, 0);

    return {
      totalEstimates: estimates.length,
      staleEstimates: stale.length,
      bookedEstimates: booked.length,
      totalValue,
      staleValue,
      atRiskPercent: totalValue > 0 ? Math.round((staleValue / totalValue) * 100) : 0,
      conversionRate: estimates.length > 0 ? Math.round((booked.length / estimates.length) * 100) : 0,
    };
  }
}

export const reportingService = new ReportingService();
