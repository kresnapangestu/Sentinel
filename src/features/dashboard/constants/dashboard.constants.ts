import type { CurrentUser, KPIKey, NavItem, TrafficRangeKey, TrafficRangeOption } from "../types";

export const CURRENT_USER: CurrentUser = {
  name: "development",
  email: "development@sentinel.com",
};

/** Only routes that exist under src/app belong here -- a nav entry without a
 * matching route renders as a 404. */
export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: "overview", href: "/dashboard" },
  {
    id: "KPIMonitoring",
    label: "KPI Monitoring",
    icon: "kpiMonitoring",
    href: "/dashboard/kpi-monitoring",
  },
];

export const ACTIVE_NAV_ID = "overview";

export const TRAFFIC_RANGE_OPTIONS: TrafficRangeOption[] = [
  { key: "24h", label: "24 Hours" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
];

export const DEFAULT_TRAFFIC_RANGE: TrafficRangeKey = "24h";
export const DEFAULT_KPI: KPIKey = "availability";
