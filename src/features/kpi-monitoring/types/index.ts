import type { KPIKey } from "@/features/dashboard/types";

/**
 * Mirrors the gateway contract in
 * nest-gateway/src/modules/kpi-monitoring/domain/kpi-overview.model.ts.
 * Keep both files in sync.
 */

export type AnomalySource = "isolation-forest" | "zscore";

/**
 * Isolation Forest contamination: a numeric proportion, or "auto" for the
 * Liu et al. (2008) offset. Mirrors `Contamination` in
 * nest-gateway/src/shared/ml-client/ml-client.types.ts.
 */
export type Contamination = number | "auto";

export type AnomalySeverity = "critical" | "high" | "medium";

export interface AnomalyMetric {
  kpi: string;
  displayName: string;
  unit: string | null;
  value: number;
  /** Z-Score mean baseline for the reference day. */
  expected: number;
  std: number;
  zScore: number;
  threshold: number;
  anomaly: boolean;
}

export interface AnomalyEvent {
  timestamp: string;
  /** WIB `HH:mm`. */
  timeLabel: string;
  /** 0..287 bucket index within the reference day. */
  slot: number;
  sources: AnomalySource[];
  severity: AnomalySeverity;
  anomalyScore: number | null;
  metrics: AnomalyMetric[];
}

export interface KpiZScoreSummary {
  threshold: number | null;
  anomaliesCount: number;
  anomalies: AnomalyEvent[];
}

export type GroundTruthAnomalyType = "SUDDEN_SPIKE" | "SUDDEN_DROP" | "TREND_BREAK";
export type GroundTruthDirection = "INCREASE" | "DECREASE";
export type GroundTruthSeverity = "MINOR" | "MODERATE" | "MAJOR" | "CRITICAL";

/**
 * A labelled anomaly window from the `kpi_ground_truth` table.
 *
 * This is the experiment's *reference truth*, produced by the data generator.
 * It is NOT a detector output and must never be rendered as one -- the chart
 * draws it as a background band, while Z-Score / Isolation Forest results stay
 * point markers.
 */
export interface KpiGroundTruthBand {
  eventId: string;
  anomalyType: GroundTruthAnomalyType;
  direction: GroundTruthDirection;
  severity: GroundTruthSeverity;
  /** Slot bounds within the reference day (inclusive). */
  startSlot: number;
  peakSlot: number;
  endSlot: number;
  startLabel: string;
  peakLabel: string;
  endLabel: string;
  /** True when the window continues outside the reference day. */
  clipped: boolean;
  description: string;
}

export interface KpiOverviewSeries {
  kpi: KPIKey;
  displayName: string;
  unit: string | null;
  /** 288 slots; null where the bucket has no reading or is past the WIB cutoff. */
  today: (number | null)[];
  latestValue: number | null;
  todayPointCount: number;
  zscore: KpiZScoreSummary;
  /** Labelled windows for this KPI on the reference day. Never detector output. */
  groundTruth: KpiGroundTruthBand[];
}

export interface IsolationForestOverview {
  available: boolean;
  reason: string | null;
  contamination: Contamination | null;
  anomaliesCount: number;
  anomalies: AnomalyEvent[];
}

export interface KpiOverview {
  timezone: string;
  referenceDate: string;
  isLiveDay: boolean;
  cutoffSlot: number;
  cutoffTime: string;
  slots: string[];
  generatedAt: string;
  detectionStatus: "ok" | "degraded";
  detectionMessage: string | null;
  isolationForest: IsolationForestOverview;
  kpis: KpiOverviewSeries[];
  /** Ground-truth windows on the reference day across the selected KPIs. */
  groundTruthWindowCount: number;
}

/** What the shared anomaly modal is currently showing. */
export interface AnomalyModalState {
  source: AnomalySource;
  title: string;
  subtitle: string;
  events: AnomalyEvent[];
  /** Set for the Z-Score variant; null for the multivariate summary. */
  kpi: KPIKey | null;
  contamination: Contamination | null;
  threshold: number | null;
}
