"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import type { CurrentUser, NavItem } from "../types";

export interface DashboardData {
  user: CurrentUser;
  navItems: NavItem[];
  activeNavId: string;
}

export interface UseDashboardDataResult {
  data: DashboardData | null;
  isLoading: boolean;
}

/**
 * Shell data every authenticated page needs: the signed-in identity and the
 * navigation rail. Live KPI figures come from useDashboardOverview (dashboard)
 * and useKpiMonitoring (KPI Monitoring) instead.
 */
export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([dashboardService.getCurrentUser(), dashboardService.getNavItems()]).then(
      ([user, nav]) => {
        if (cancelled) return;
        setData({ user, navItems: nav.items, activeNavId: nav.activeId });
        setIsLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading };
}
