"use client";

import { useCallback, useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import type { KPIKey, TrafficRangeKey, TrafficSummary } from "../types";
import {
  DEFAULT_KPI,
  DEFAULT_TRAFFIC_RANGE,
} from "../constants/dashboard.constants";

export interface UseTrafficRangeResult {
  range: TrafficRangeKey;
  setRange: (range: TrafficRangeKey) => void;
  kpi: KPIKey;
  setKPI: (kpi: KPIKey) => void;
  summary: TrafficSummary | null;
  isLoading: boolean;
}

/**
 * Owns the selected time range and the corresponding traffic data fetch.
 * The chart component stays presentational -- it only ever renders
 * `summary`.
 */
export function useTrafficRange(): UseTrafficRangeResult {
  const [range, setRange] = useState<TrafficRangeKey>(
    DEFAULT_TRAFFIC_RANGE as TrafficRangeKey,
  );
  const [kpi, setKpi] = useState<KPIKey>(DEFAULT_KPI as KPIKey);
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    void dashboardService.getTraffic(range).then((result) => {
      if (!cancelled) {
        setSummary(result);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [range]);

  const handleSetRange = useCallback((next: TrafficRangeKey) => {
    setRange(next);
  }, []);

  const handleSetKPI = useCallback((next: KPIKey) => {
    setKpi(next);
  }, []);

  return {
    kpi,
    setKPI: handleSetKPI,
    range,
    setRange: handleSetRange,
    summary,
    isLoading,
  };
}
