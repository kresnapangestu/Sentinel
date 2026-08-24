/** Domain types for the dashboard feature. */

import { AutocompleteOption } from "@/components/atoms/Autocomplete";

export type IconKey =
  | "overview"
  | "logout"
  | "menu"
  | "bell"
  | "chevronDown"
  | "home"
  | "infinity"
  | "grid"
  | "traffic"
  | "shield"
  | "check"
  | "kpiMonitoring";

export interface NavItem {
  id: string;
  label: string;
  icon: IconKey;
  href: string;
}

export interface CurrentUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

/** Badge tone for a stat card's secondary figure. */
export type StatTone = "neutral" | "success" | "error";

export interface StatCardData {
  id: string;
  icon: IconKey;
  /** KPI name shown as the card heading, e.g. "Critical KPIs". */
  title: string;
  /** What the headline number counts, e.g. "Reporting today". */
  valueLabel: string;
  value: string;
  unit: string;
  badge: {
    label: string;
    tone: StatTone;
  };
  caption: string;
  /** Per-hour counts over the reference day. */
  sparkline: number[];
}

export type TrafficRangeKey = "24h" | "7d" | "30d";

export interface TrafficRangeOption {
  key: TrafficRangeKey;
  label: string;
}

// Must match the KPI `name` values in nest-gateway/prisma/seed/kpi-definitions.ts.
export const KPI_OPTIONS = [
  {
    label: "Throughput",
    value: "throughput",
  },
  {
    label: "Latency",
    value: "latency",
  },
  {
    label: "Packet Loss",
    value: "packet-loss",
  },
  {
    label: "Availability",
    value: "availability",
  },
  {
    label: "Jitter",
    value: "jitter",
  },
  {
    label: "PRB Utilization",
    value: "prb-utilization",
  },
  {
    label: "Active Users",
    value: "active-users",
  },
  {
    label: "RRC Success Rate",
    value: "rrc-success-rate",
  },
  {
    label: "Handover Success Rate",
    value: "handover-success-rate",
  },
  {
    label: "Call Drop Rate",
    value: "call-drop-rate",
  },
] satisfies readonly AutocompleteOption[];

export type KPIKey = (typeof KPI_OPTIONS)[number]["value"];

export interface KPIOption {
  label: string;
  value: KPIKey;
}

export interface TrafficPoint {
  time: string;
  value: number;
}

/**
 * Mirrors the gateway contract in
 * nest-gateway/src/modules/dashboard/domain/dashboard-overview.model.ts.
 */
export interface DashboardTotals {
  kpis: number;
  reporting: number;
  normal: number;
  critical: number;
}

export interface DashboardHourly {
  labels: string[];
  reporting: number[];
  normal: number[];
  critical: number[];
}

export interface DashboardTraffic {
  kpi: string;
  displayName: string;
  unit: string | null;
  range: TrafficRangeKey;
  points: TrafficPoint[];
  peak: number | null;
  average: number | null;
  latest: { time: string; value: number; index: number } | null;
}

export interface DashboardCriticalKpi {
  kpi: string;
  displayName: string;
  anomaliesCount: number;
}

export interface DashboardOverview {
  timezone: string;
  referenceDate: string;
  generatedAt: string;
  detectionStatus: "ok" | "degraded";
  detectionMessage: string | null;
  zscoreThreshold: number | null;
  totals: DashboardTotals;
  hourly: DashboardHourly;
  criticalKpis: DashboardCriticalKpi[];
  traffic: DashboardTraffic;
}
