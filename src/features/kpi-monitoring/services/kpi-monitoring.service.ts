import { apiGet } from "@/lib/api-client";
import type { KPIKey } from "@/features/dashboard/types";
import type { AnomalyEvent, Contamination, KpiOverview } from "../types";

export interface KpiOverviewParams {
  kpis: KPIKey[];
  date: string;
  /** Z-Score sensitivity override; omit to use the ML service default. */
  zscoreThreshold?: number;
  /** Isolation Forest contamination override; omit to use the ML service default. */
  contamination?: Contamination;
}

export const kpiMonitoringService = {
  /**
   * One request per dashboard state: the reference day's series, Z-Score
   * anomalies per KPI, and the multivariate Isolation Forest result. The
   * gateway fans out to PostgreSQL/ML, so the page never issues one request
   * per KPI.
   */
  async getOverview(
    { kpis, date, zscoreThreshold, contamination }: KpiOverviewParams,
    signal?: AbortSignal,
  ): Promise<KpiOverview> {
    return apiGet<KpiOverview>(
      "/kpi-monitoring/overview",
      { kpis, date: date || undefined, zscoreThreshold, contamination },
      signal,
    );
  },
};

/**
 * Merges Isolation Forest events into one KPI's Z-Score events for a chart:
 * a timestamp both methods flagged renders as a single marker carrying both
 * sources, instead of two markers stacked on the same point.
 */
export function mergeEventsForKpi(
  kpi: KPIKey,
  zscoreEvents: AnomalyEvent[],
  isolationForestEvents: AnomalyEvent[],
): AnomalyEvent[] {
  const bySlot = new Map<number, AnomalyEvent>();

  for (const event of zscoreEvents) bySlot.set(event.slot, event);

  for (const event of isolationForestEvents) {
    const existing = bySlot.get(event.slot);

    if (existing) {
      bySlot.set(event.slot, {
        ...existing,
        sources: existing.sources.includes("isolation-forest")
          ? existing.sources
          : [...existing.sources, "isolation-forest"],
        anomalyScore: existing.anomalyScore ?? event.anomalyScore,
      });
      continue;
    }

    // Isolation Forest is multivariate: keep only this KPI's contribution so
    // the marker lands on this chart's own line.
    const metric = event.metrics.find((candidate) => candidate.kpi === kpi);
    if (!metric) continue;

    bySlot.set(event.slot, { ...event, metrics: [metric] });
  }

  return [...bySlot.values()].sort((a, b) => a.slot - b.slot);
}
