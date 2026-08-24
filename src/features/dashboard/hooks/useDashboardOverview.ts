"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { dashboardService } from "../services/dashboard.service";
import { DEFAULT_KPI, DEFAULT_TRAFFIC_RANGE } from "../constants/dashboard.constants";
import type { DashboardOverview, KPIKey, TrafficRangeKey } from "../types";

export interface UseDashboardOverviewResult {
  range: TrafficRangeKey;
  setRange: (range: TrafficRangeKey) => void;
  kpi: KPIKey;
  setKPI: (kpi: KPIKey) => void;
  overview: DashboardOverview | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Owns the dashboard's range/KPI selection and the single gateway request that
 * backs every card on the page. In-flight requests are aborted when the
 * selection changes, so a slow response cannot overwrite a newer one.
 */
export function useDashboardOverview(): UseDashboardOverviewResult {
  const [range, setRange] = useState<TrafficRangeKey>(DEFAULT_TRAFFIC_RANGE);
  const [kpi, setKPI] = useState<KPIKey>(DEFAULT_KPI);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    try {
      const result = await dashboardService.getOverview(range, kpi, controller.signal);
      if (controller.signal.aborted) return;
      setOverview(result);
      setError(null);
    } catch (err: unknown) {
      if (controller.signal.aborted || (err instanceof DOMException && err.name === "AbortError")) {
        return;
      }
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, [range, kpi]);

  useEffect(() => {
    void load();

    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [load]);

  return {
    range,
    setRange,
    kpi,
    setKPI,
    overview,
    isLoading,
    error,
    refresh: useCallback(() => void load(), [load]),
  };
}
