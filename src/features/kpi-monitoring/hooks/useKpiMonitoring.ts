"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KPIKey } from "@/features/dashboard/types";
import { ApiError } from "@/lib/api-client";
import { kpiMonitoringService } from "../services/kpi-monitoring.service";
import {
  AUTO_REFERENCE_DATE,
  DEFAULT_SELECTED_KPIS,
  KPI_REFRESH_INTERVAL_MS,
} from "../constants/kpi-monitoring.constants";
import type { Contamination, KpiOverview } from "../types";

export interface UseKpiMonitoringResult {
  selectedKpis: KPIKey[];
  setSelectedKpis: (value: KPIKey[]) => void;
  /** "" = let the gateway pick the newest WIB day that has data. */
  referenceDate: string;
  setReferenceDate: (value: string) => void;
  /** The day actually rendered, as resolved by the gateway. */
  resolvedDate: string;
  /** null = use the ML service default. */
  zscoreThreshold: number | null;
  setZscoreThreshold: (value: number | null) => void;
  contamination: Contamination | null;
  setContamination: (value: Contamination | null) => void;
  overview: KpiOverview | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
  refresh: () => void;
}

/**
 * Owns the KPI Monitoring page state and the *only* polling timer in the app.
 *
 * One interval (KPI_REFRESH_INTERVAL_MS) exists per filter selection and is
 * torn down with it, so changing filters or unmounting can never leave a
 * second timer running. Every tick aborts the previous in-flight request
 * before issuing a new one, so a slow response cannot overwrite a newer one
 * and requests never pile up.
 */
export function useKpiMonitoring(): UseKpiMonitoringResult {
  const [selectedKpis, setSelectedKpis] = useState<KPIKey[]>(DEFAULT_SELECTED_KPIS);
  const [referenceDate, setReferenceDate] = useState<string>(AUTO_REFERENCE_DATE);
  const [zscoreThreshold, setZscoreThreshold] = useState<number | null>(null);
  const [contamination, setContamination] = useState<Contamination | null>(null);

  const [overview, setOverview] = useState<KpiOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Primitive dep: a new array holding the same KPIs must not restart polling.
  const kpisKey = useMemo(() => [...selectedKpis].sort().join(","), [selectedKpis]);

  const load = useCallback(
    async (background: boolean) => {
      const kpis = kpisKey ? (kpisKey.split(",") as KPIKey[]) : [];

      if (kpis.length === 0) {
        abortRef.current?.abort();
        abortRef.current = null;
        setOverview(null);
        setError(null);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (background) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const result = await kpiMonitoringService.getOverview(
          {
            kpis,
            date: referenceDate,
            zscoreThreshold: zscoreThreshold ?? undefined,
            contamination: contamination ?? undefined,
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;

        setOverview(result);
        setLastUpdatedAt(result.generatedAt);
        setError(null);
      } catch (err: unknown) {
        if (
          controller.signal.aborted ||
          (err instanceof DOMException && err.name === "AbortError")
        ) {
          return;
        }

        setError(err instanceof ApiError ? err.message : "Failed to load KPI data.");
        // A failed background refresh keeps the last good data on screen.
        if (!background) setOverview(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [kpisKey, referenceDate, zscoreThreshold, contamination],
  );

  useEffect(() => {
    void load(false);
    const interval = window.setInterval(() => void load(true), KPI_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [load]);

  const refresh = useCallback(() => void load(true), [load]);

  return {
    selectedKpis,
    setSelectedKpis,
    referenceDate,
    setReferenceDate,
    resolvedDate: referenceDate || overview?.referenceDate || "",
    zscoreThreshold,
    setZscoreThreshold,
    contamination,
    setContamination,
    overview,
    isLoading,
    isRefreshing,
    error,
    lastUpdatedAt,
    refresh,
  };
}
