import { apiGet } from "@/lib/api-client";
import { ACTIVE_NAV_ID, CURRENT_USER, NAV_ITEMS } from "../constants/dashboard.constants";
import type {
  CurrentUser,
  DashboardOverview,
  KPIKey,
  NavItem,
  StatCardData,
  TrafficRangeKey,
} from "../types";

/**
 * Dashboard data access. Live figures come from the NestJS gateway (which owns
 * PostgreSQL and the ML service); only the shell's navigation and the signed-in
 * identity stay local, since authentication is not wired to the API yet.
 */
export const dashboardService = {
  getCurrentUser(): Promise<CurrentUser> {
    return Promise.resolve(CURRENT_USER);
  },

  getNavItems(): Promise<{ items: NavItem[]; activeId: string }> {
    return Promise.resolve({ items: NAV_ITEMS, activeId: ACTIVE_NAV_ID });
  },

  async getOverview(
    range: TrafficRangeKey,
    kpi: KPIKey,
    signal?: AbortSignal,
  ): Promise<DashboardOverview> {
    return apiGet<DashboardOverview>("/dashboard/overview", { range, kpi }, signal);
  },
};

export function formatKpiValue(value: number | null, unit: string | null): string {
  if (value === null) return "--";
  const formatted = Math.abs(value) >= 1000 ? value.toFixed(0) : value.toFixed(2);
  return unit ? `${formatted} ${unit}` : formatted;
}

function shareOf(value: number, total: number): string {
  return total > 0 ? `${Math.round((value / total) * 100)}% of reporting` : "no data";
}

/**
 * Maps the gateway overview onto the StatCard contract. KPI health is the
 * univariate Z-Score verdict for the reference day: a KPI with at least one
 * anomaly counts as critical, every other reporting KPI as normal.
 */
export function toStatCards(overview: DashboardOverview): StatCardData[] {
  const { totals, hourly } = overview;
  const suffix = (count: number) => (count === 1 ? " KPI" : " KPIs");

  return [
    {
      id: "monitored",
      icon: "home",
      title: "Monitored KPIs",
      valueLabel: "In catalogue",
      value: String(totals.kpis),
      unit: suffix(totals.kpis),
      badge: { label: `${totals.reporting} reporting`, tone: "neutral" },
      caption: "Definitions tracked by the collector",
      sparkline: hourly.reporting,
    },
    {
      id: "normal",
      icon: "infinity",
      title: "Normal KPIs",
      valueLabel: "Within threshold",
      value: String(totals.normal),
      unit: suffix(totals.normal),
      badge: { label: shareOf(totals.normal, totals.reporting), tone: "success" },
      caption: "No Z-Score anomaly on this day",
      sparkline: hourly.normal,
    },
    {
      id: "critical",
      icon: "grid",
      title: "Critical KPIs",
      valueLabel: "Threshold exceeded",
      value: String(totals.critical),
      unit: suffix(totals.critical),
      badge: {
        label: shareOf(totals.critical, totals.reporting),
        tone: totals.critical > 0 ? "error" : "neutral",
      },
      // A zero count is a clean day, not "at least one anomaly".
      caption:
        totals.critical > 0 ? "At least one Z-Score anomaly" : "No Z-Score anomaly on this day",
      sparkline: hourly.critical,
    },
  ];
}
