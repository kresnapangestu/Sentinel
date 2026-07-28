import {
  ACTIVE_NAV_ID,
  ACTIVE_PROXY_TAB,
  CURRENT_USER,
  DEFAULT_TRAFFIC_RANGE,
  HELP_LINKS,
  NAV_ITEMS,
  NOTIFICATION_COUNT,
  PACKAGE_INFO,
  PRICING_OPTIONS,
  PROXY_TABS,
  SECURITY_INFO,
  STAT_CARDS,
  TRAFFIC_24H,
  TRAFFIC_30D,
  TRAFFIC_7D,
  TRAFFIC_AVERAGE_LABEL,
  TRAFFIC_HIGHLIGHT_LABEL,
  TRAFFIC_PEAK_LABEL,
  TRAFFIC_RANGE_OPTIONS,
} from "../constants/dashboard.constants";
import type {
  ChecklistSection,
  CurrentUser,
  HelpLink,
  NavItem,
  PricingOption,
  ProxyTab,
  SecurityInfo,
  StatCardData,
  TrafficRangeKey,
  TrafficRangeOption,
  TrafficSummary,
} from "../types";

const MOCK_LATENCY_MS = 0;

function resolveAfter<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

const TRAFFIC_BY_RANGE: Record<TrafficRangeKey, typeof TRAFFIC_24H> = {
  "24h": TRAFFIC_24H,
  "7d": TRAFFIC_7D,
  "30d": TRAFFIC_30D,
};

/**
 * Dashboard data service. Every export here is the single seam a real
 * backend integration would replace -- nothing above this layer (hooks,
 * components) reads mock constants directly.
 */
export const dashboardService = {
  getCurrentUser(): Promise<CurrentUser> {
    return resolveAfter(CURRENT_USER);
  },

  getNavItems(): Promise<{ items: NavItem[]; activeId: string }> {
    return resolveAfter({ items: NAV_ITEMS, activeId: ACTIVE_NAV_ID });
  },

  getProxyTabs(): Promise<{ tabs: ProxyTab[]; activeId: string }> {
    return resolveAfter({ tabs: PROXY_TABS, activeId: ACTIVE_PROXY_TAB });
  },

  getStatCards(): Promise<StatCardData[]> {
    return resolveAfter(STAT_CARDS);
  },

  getTrafficRangeOptions(): Promise<{
    options: TrafficRangeOption[];
    defaultKey: TrafficRangeKey;
  }> {
    return resolveAfter({
      options: TRAFFIC_RANGE_OPTIONS,
      defaultKey: DEFAULT_TRAFFIC_RANGE as TrafficRangeKey,
    });
  },

  getTraffic(range: TrafficRangeKey): Promise<TrafficSummary> {
    const points = TRAFFIC_BY_RANGE[range];
    const highlightIndex = range === "24h" ? 12 : Math.floor(points.length / 2);

    return resolveAfter({
      peakLabel: TRAFFIC_PEAK_LABEL,
      averageLabel: TRAFFIC_AVERAGE_LABEL,
      points,
      highlight: {
        time: TRAFFIC_HIGHLIGHT_LABEL,
        valueLabel: "0.7 MB",
        index: highlightIndex,
      },
    });
  },

  getPackageInfo(): Promise<ChecklistSection> {
    return resolveAfter(PACKAGE_INFO);
  },

  getSecurityInfo(): Promise<SecurityInfo> {
    return resolveAfter(SECURITY_INFO);
  },

  getHelpLinks(): Promise<HelpLink[]> {
    return resolveAfter(HELP_LINKS);
  },

  getPricingOptions(): Promise<PricingOption[]> {
    return resolveAfter(PRICING_OPTIONS);
  },

  getNotificationCount(): Promise<number> {
    return resolveAfter(NOTIFICATION_COUNT);
  },
};
