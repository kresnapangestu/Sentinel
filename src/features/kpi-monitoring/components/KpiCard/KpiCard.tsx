"use client";

import { useMemo } from "react";
import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { EChart } from "@/components/molecules/EChart";
import { useTheme } from "@/hooks/useTheme";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  buildKpiSeriesChartOption,
  getKpiChartColors,
  MARKER_STYLE,
  type AnomalyMarker,
  type AnomalyMarkerKind,
  type GroundTruthBand,
} from "@/features/dashboard/services/chart-options.service";
import { cn } from "@/utils/cn";
import { KPI_METADATA } from "../../constants/kpi-monitoring.constants";
import { mergeEventsForKpi } from "../../services/kpi-monitoring.service";
import { KpiAlertButton } from "../KpiAlertButton";
import type { AnomalyEvent, GroundTruthAnomalyType, KpiOverviewSeries } from "../../types";

export interface KpiCardProps {
  series: KpiOverviewSeries;
  slots: string[];
  todayDateLabel: string;
  /** Multivariate events for the current filter; markers are matched per KPI. */
  isolationForestEvents: AnomalyEvent[];
  onOpenZScore: (series: KpiOverviewSeries) => void;
  /** Grid position, staggers this card's reveal a beat after the previous one. */
  index?: number;
}

function formatValue(value: number | null, unit: string | null): string {
  if (value === null) return "--";
  const formatted = Math.abs(value) >= 1000 ? value.toFixed(0) : value.toFixed(2);
  return unit ? `${formatted} ${unit}` : formatted;
}

/** Index of the newest slot that reported, for the "latest reading" timestamp. */
function latestSlotIndex(today: (number | null)[]): number {
  for (let slot = today.length - 1; slot >= 0; slot -= 1) {
    if (today[slot] !== null) return slot;
  }
  return -1;
}

/** Marker shapes mirror the canvas symbols so the key is readable at a glance. */
const MARKER_SHAPE: Record<AnomalyMarkerKind, string> = {
  zscore: "rotate-45 rounded-[1px]",
  "isolation-forest": "rounded-[1px]",
  both: "rounded-pill",
};

/** Human-readable name of each labelled anomaly type, for the band caption. */
const GROUND_TRUTH_TYPE_LABEL: Record<GroundTruthAnomalyType, string> = {
  SUDDEN_SPIKE: "sudden spike",
  SUDDEN_DROP: "sudden drop",
  TREND_BREAK: "trend break",
};

/**
 * Legend rendered in HTML rather than on the canvas: it inherits the design
 * system's type and spacing, and cannot collide with the axis labels.
 */
function ChartLegend({
  theme,
  todayDateLabel,
  markerKinds,
  hasGroundTruth,
}: {
  theme: "light" | "dark";
  todayDateLabel: string;
  markerKinds: AnomalyMarkerKind[];
  hasGroundTruth: boolean;
}) {
  const colors = getKpiChartColors(theme);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-5 pb-3 text-xs text-text-secondary">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-[3px] w-5 rounded-pill"
          style={{ backgroundColor: colors.today }}
          aria-hidden="true"
        />
        Reading <span className="opacity-70">{todayDateLabel}</span>
      </span>

      {/* Named "labelled", and drawn as a band rather than a marker, so it can
          never read as one of the detectors' outputs. */}
      {hasGroundTruth ? (
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-5 rounded-[2px] border border-dashed"
            style={{ backgroundColor: colors.groundTruth, borderColor: colors.groundTruthEdge }}
            aria-hidden="true"
          />
          Ground truth <span className="opacity-70">(labelled window)</span>
        </span>
      ) : null}

      {markerKinds.map((kind) => (
        <span key={kind} className="inline-flex items-center gap-1.5">
          <span
            className={cn("h-2 w-2", MARKER_SHAPE[kind])}
            style={{ backgroundColor: colors[kind] }}
            aria-hidden="true"
          />
          {MARKER_STYLE[kind].label} <span className="opacity-70">(predicted)</span>
        </span>
      ))}
    </div>
  );
}

/** One KPI chart card: the reference day's readings, with anomaly markers. */
export function KpiCard({
  series,
  slots,
  todayDateLabel,
  isolationForestEvents,
  onOpenZScore,
  index = 0,
}: KpiCardProps) {
  const { theme } = useTheme();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const events = useMemo(
    () => mergeEventsForKpi(series.kpi, series.zscore.anomalies, isolationForestEvents),
    [series.kpi, series.zscore.anomalies, isolationForestEvents],
  );

  const markers = useMemo<AnomalyMarker[]>(
    () =>
      events.flatMap((event) => {
        const metric = event.metrics[0];
        const value = series.today[event.slot];
        if (!metric || value === null || value === undefined) return [];

        const kind =
          event.sources.length > 1
            ? "both"
            : event.sources[0] === "isolation-forest"
              ? "isolation-forest"
              : "zscore";

        const detail = [
          `z ${metric.zScore.toFixed(2)} / ±${metric.threshold.toFixed(1)}`,
          event.anomalyScore !== null ? `score ${event.anomalyScore.toFixed(3)}` : null,
          `baseline ${formatValue(metric.expected, metric.unit)}`,
        ]
          .filter(Boolean)
          .join(" · ");

        return [{ slot: event.slot, value, kind, detail } satisfies AnomalyMarker];
      }),
    [events, series.today],
  );

  // Ground truth comes straight from the API's `groundTruth` field, which the
  // gateway reads from PostgreSQL. It is never derived from `series.zscore` or
  // from the Isolation Forest events above.
  const groundTruthBands = useMemo<GroundTruthBand[]>(
    () =>
      series.groundTruth.map((band) => ({
        eventId: band.eventId,
        startSlot: band.startSlot,
        endSlot: band.endSlot,
        // Just the id on the canvas: a 5-tick window is only a few pixels
        // wide, so a longer caption overlaps the line or clips at the grid
        // edge. The anomaly type stays one hover away, in `detail`.
        label: band.eventId,
        detail: [
          GROUND_TRUTH_TYPE_LABEL[band.anomalyType],
          `${band.startLabel}–${band.endLabel} WIB · peak ${band.peakLabel}`,
          band.clipped ? "continues outside this day" : null,
        ]
          .filter(Boolean)
          .join(" · "),
      })),
    [series.groundTruth],
  );

  const option = useMemo(
    () =>
      buildKpiSeriesChartOption(
        {
          slots,
          today: series.today,
          todayDateLabel,
          unit: series.unit,
          anomalies: markers,
          groundTruth: groundTruthBands,
        },
        theme,
      ),
    [slots, series.today, series.unit, todayDateLabel, markers, groundTruthBands, theme],
  );

  const markerKinds = useMemo<AnomalyMarkerKind[]>(
    () =>
      (["both", "isolation-forest", "zscore"] as const).filter((kind) =>
        markers.some((marker) => marker.kind === kind),
      ),
    [markers],
  );

  const latestSlot = latestSlotIndex(series.today);
  const agreedCount = series.zscore.anomalies.filter((event) => event.sources.length > 1).length;
  const hasData = series.todayPointCount > 0;

  return (
    <Card
      ref={ref}
      style={{ "--stagger": index } as React.CSSProperties}
      className={cn(
        "reveal flex flex-col p-0 transition duration-DEFAULT hover:border-border-hover hover:shadow-md",
        isVisible && "is-visible",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
        <div className="min-w-0">
          <Typography variant="h2" className="truncate text-base">
            {series.displayName}
          </Typography>
          <Typography variant="caption" as="p" className="truncate">
            {KPI_METADATA[series.kpi]?.subtitle ?? series.unit ?? ""}
          </Typography>
        </div>
        <KpiAlertButton
          anomalyCount={series.zscore.anomaliesCount}
          agreedCount={agreedCount}
          kpiName={series.displayName}
          onClick={() => onOpenZScore(series)}
        />
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 px-5 pb-2">
        <span className="text-2xl font-semibold tabular-nums leading-none text-text">
          {formatValue(series.latestValue, series.unit)}
        </span>
        <span className="text-xs text-text-secondary">
          {latestSlot >= 0 ? `latest · ${slots[latestSlot]} WIB` : "no reading"}
        </span>
      </div>

      <div className="h-[240px] px-2">
        {hasData ? (
          <EChart option={option} theme={theme} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-5 text-center">
            <Typography variant="bodySmall" as="p">
              No readings on this day
            </Typography>
            <Typography variant="caption">
              Select another date, or check the collector for {series.displayName}.
            </Typography>
          </div>
        )}
      </div>

      {hasData ? (
        <ChartLegend
          theme={theme}
          todayDateLabel={todayDateLabel}
          markerKinds={markerKinds}
          hasGroundTruth={groundTruthBands.length > 0}
        />
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border px-5 py-2.5 text-xs text-text-secondary">
        <span className="tabular-nums">
          {series.todayPointCount} reading{series.todayPointCount === 1 ? "" : "s"}
        </span>
        {series.zscore.threshold !== null ? (
          <span className="tabular-nums">Z-Score threshold ±{series.zscore.threshold.toFixed(1)}σ</span>
        ) : null}
      </div>
    </Card>
  );
}
