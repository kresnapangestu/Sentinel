"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import type {
  ChecklistSection,
  CurrentUser,
  HelpLink,
  NavItem,
  PricingOption,
  ProxyTab,
  SecurityInfo,
  StatCardData,
} from "../types";

export interface DashboardData {
  user: CurrentUser;
  navItems: NavItem[];
  activeNavId: string;
  proxyTabs: ProxyTab[];
  activeProxyTabId: string;
  statCards: StatCardData[];
  packageInfo: ChecklistSection;
  securityInfo: SecurityInfo;
  helpLinks: HelpLink[];
  pricingOptions: PricingOption[];
  notificationCount: number;
}

export interface UseDashboardDataResult {
  data: DashboardData | null;
  isLoading: boolean;
}

/**
 * Single entry point for every "mostly static" dashboard section. Kept as
 * one hook (rather than one per card) since these all load together on
 * page mount and none of them depend on the others.
 */
export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      dashboardService.getCurrentUser(),
      dashboardService.getNavItems(),
      dashboardService.getProxyTabs(),
      dashboardService.getStatCards(),
      dashboardService.getPackageInfo(),
      dashboardService.getSecurityInfo(),
      dashboardService.getHelpLinks(),
      dashboardService.getPricingOptions(),
      dashboardService.getNotificationCount(),
    ]).then(
      ([
        user,
        nav,
        proxyTabs,
        statCards,
        packageInfo,
        securityInfo,
        helpLinks,
        pricingOptions,
        notificationCount,
      ]) => {
        if (cancelled) return;
        setData({
          user,
          navItems: nav.items,
          activeNavId: nav.activeId,
          proxyTabs: proxyTabs.tabs,
          activeProxyTabId: proxyTabs.activeId,
          statCards,
          packageInfo,
          securityInfo,
          helpLinks,
          pricingOptions,
          notificationCount,
        });
        setIsLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading };
}
