"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Sigma, TreePine } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Typography } from "@/components/atoms/Typography";
import { Modal } from "@/components/molecules/Modal";
import { formatWibDayLabel, formatWibTimestamp } from "@/lib/wib";
import { cn } from "@/utils/cn";
import { formatContamination } from "../../constants/kpi-monitoring.constants";
import type {
  AnomalyEvent,
  AnomalyMetric,
  AnomalyModalState,
  AnomalySeverity,
  AnomalySource,
} from "../../types";

export interface AnomalyDetailsModalProps {
  state: AnomalyModalState | null;
  referenceDate: string;
  onClose: () => void;
}

const SEVERITY_STYLE: Record<AnomalySeverity, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-error-soft text-error" },
  high: { label: "High", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  medium: { label: "Medium", className: "bg-background text-text-secondary" },
};

const SOURCE_STYLE: Record<AnomalySource, { label: string; className: string }> = {
  "isolation-forest": {
    label: "Isolation Forest",
    className: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  },
  zscore: {
    label: "Z-Score",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
};

/** How many rows render before the "show more" step, so a 500-anomaly day stays fast. */
const PAGE_SIZE = 50;

function formatNumber(value: number, unit: string | null): string {
  const formatted = Math.abs(value) >= 1000 ? value.toFixed(0) : value.toFixed(2);
  return unit ? `${formatted} ${unit}` : formatted;
}

/** The KPI that moved the most at this timestamp -- what a multivariate event is "about". */
function driverMetric(event: AnomalyEvent): AnomalyMetric | null {
  return (
    [...event.metrics].sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore))[0] ?? null
  );
}

function SourceBadges({ sources }: { sources: AnomalySource[] }) {
  if (sources.length > 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-pill bg-error-soft px-2 py-0.5 text-[11px] font-semibold text-error">
        <TreePine size={11} />
        <Sigma size={11} />
        Both methods
      </span>
    );
  }

  const source = sources[0];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold",
        SOURCE_STYLE[source].className,
      )}
    >
      {source === "isolation-forest" ? <TreePine size={11} /> : <Sigma size={11} />}
      {SOURCE_STYLE[source].label}
    </span>
  );
}

function AnomalyRow({ event }: { event: AnomalyEvent }) {
  const [expanded, setExpanded] = useState(false);
  const driver = driverMetric(event);
  const extraMetrics = event.metrics.filter((metric) => metric !== driver);

  return (
    <li className="border-b border-border/70 last:border-b-0">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-5 py-3 transition duration-DEFAULT hover:bg-background/60 sm:grid-cols-[104px_1fr_auto] sm:items-center">
        <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-pill",
              event.severity === "critical"
                ? "bg-error"
                : event.severity === "high"
                  ? "bg-amber-500"
                  : "bg-text-secondary/50",
            )}
            aria-hidden="true"
          />
          <span className="font-mono text-sm tabular-nums text-text">{event.timeLabel}</span>
        </div>

        <div className="min-w-0">
          {driver ? (
            <>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold text-text">{driver.displayName}</span>
                <span className="text-sm tabular-nums text-text">
                  {formatNumber(driver.value, driver.unit)}
                </span>
                <span className="text-xs text-text-secondary">
                  vs baseline {formatNumber(driver.expected, driver.unit)}
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-text-secondary">
                <span className="tabular-nums">
                  z = {driver.zScore.toFixed(2)}{" "}
                  <span className="opacity-70">/ ±{driver.threshold.toFixed(1)}</span>
                </span>
                {event.anomalyScore !== null ? (
                  <span className="tabular-nums">score {event.anomalyScore.toFixed(3)}</span>
                ) : null}
                {extraMetrics.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    aria-expanded={expanded}
                    className="inline-flex items-center gap-1 rounded-sm text-primary transition duration-DEFAULT hover:underline"
                  >
                    {expanded ? "Hide" : `+${extraMetrics.length} KPI`}
                    <ChevronDown
                      size={12}
                      className={cn("transition duration-DEFAULT", expanded && "rotate-180")}
                    />
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <span className="text-sm text-text-secondary">No KPI detail available.</span>
          )}
        </div>

        <div className="col-span-2 flex flex-wrap items-center justify-start gap-2 sm:col-span-1 sm:justify-end">
          <SourceBadges sources={event.sources} />
          <span
            className={cn(
              "rounded-pill px-2 py-0.5 text-[11px] font-semibold",
              SEVERITY_STYLE[event.severity].className,
            )}
          >
            {SEVERITY_STYLE[event.severity].label}
          </span>
        </div>
      </div>

      {expanded && extraMetrics.length > 0 ? (
        <div className="grid gap-1 border-t border-border/60 bg-background/50 px-5 py-3 sm:grid-cols-2">
          {extraMetrics.map((metric) => (
            <div
              key={metric.kpi}
              className="flex items-baseline justify-between gap-3 text-xs text-text-secondary"
            >
              <span className={cn("truncate", metric.anomaly && "font-semibold text-text")}>
                {metric.displayName}
              </span>
              <span className="tabular-nums">
                {formatNumber(metric.value, metric.unit)}
                <span className="opacity-70">
                  {" "}
                  · exp {formatNumber(metric.expected, metric.unit)} · z {metric.zScore.toFixed(2)}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <span className="sr-only">{formatWibTimestamp(event.timestamp)}</span>
    </li>
  );
}

/**
 * The one anomaly detail view, shared by the Isolation Forest summary card and
 * every KPI's Z-Score alert button. Isolation Forest results are grouped by the
 * KPI that drove each multivariate detection; Z-Score results are a single
 * time-ordered list for the KPI that was clicked.
 */
type SourceFilter = "all" | "single" | "both";

export function AnomalyDetailsModal({ state, referenceDate, onClose }: AnomalyDetailsModalProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  // Opening a different anomaly set starts from the top, unfiltered.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setSourceFilter("all");
  }, [state?.source, state?.kpi]);

  const events = useMemo(() => {
    const list = state?.events ?? [];
    if (sourceFilter === "both") return list.filter((event) => event.sources.length > 1);
    if (sourceFilter === "single") return list.filter((event) => event.sources.length === 1);
    return list;
  }, [state, sourceFilter]);

  const stats = useMemo(() => {
    const all = state?.events ?? [];
    return {
      total: all.length,
      agreed: all.filter((event) => event.sources.length > 1).length,
      critical: all.filter((event) => event.severity === "critical").length,
      high: all.filter((event) => event.severity === "high").length,
    };
  }, [state]);

  const groups = useMemo(() => {
    if (!state) return [];

    // A Z-Score modal is already scoped to one KPI: keep it a flat list.
    if (state.source === "zscore") {
      return [{ key: "all", label: "", events }];
    }

    const byKpi = new Map<string, { key: string; label: string; events: AnomalyEvent[] }>();
    for (const event of events) {
      const driver = driverMetric(event);
      const key = driver?.kpi ?? "unknown";
      const group = byKpi.get(key) ?? {
        key,
        label: driver?.displayName ?? "Unattributed",
        events: [],
      };
      group.events.push(event);
      byKpi.set(key, group);
    }

    return [...byKpi.values()].sort((a, b) => b.events.length - a.events.length);
  }, [state, events]);

  if (!state) return null;

  const isIsolationForest = state.source === "isolation-forest";
  let rendered = 0;

  return (
    <Modal
      open
      onClose={onClose}
      title={state.title}
      description={state.subtitle}
      headerSlot={
        <span
          className={cn(
            "hidden items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold sm:inline-flex",
            isIsolationForest
              ? SOURCE_STYLE["isolation-forest"].className
              : SOURCE_STYLE.zscore.className,
          )}
        >
          {isIsolationForest ? <TreePine size={13} /> : <Sigma size={13} />}
          {isIsolationForest ? "Multivariate" : "Univariate"}
        </span>
      }
      footerSlot={
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
          <span>
            {formatWibDayLabel(referenceDate)} · all times WIB
            {state.threshold !== null ? ` · threshold ±${state.threshold.toFixed(1)}σ` : ""}
            {state.contamination !== null
              ? ` · contamination ${formatContamination(state.contamination)}`
              : ""}
          </span>
          <span>
            Showing {Math.min(visibleCount, events.length)} of {events.length}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        {[
          { label: "Anomalies", value: stats.total },
          { label: "Both methods", value: stats.agreed },
          { label: "Critical", value: stats.critical },
          { label: "High", value: stats.high },
        ].map((tile) => (
          <div key={tile.label} className="bg-surface px-5 py-3">
            <Typography variant="caption">{tile.label}</Typography>
            <p className="m-0 text-xl font-semibold tabular-nums text-text">{tile.value}</p>
          </div>
        ))}
      </div>

      {stats.total > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-2.5">
          {(
            [
              { value: "all", label: "All" },
              { value: "single", label: `${isIsolationForest ? "Isolation Forest" : "Z-Score"} only` },
              { value: "both", label: "Both methods" },
            ] satisfies { value: SourceFilter; label: string }[]
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSourceFilter(option.value);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-pressed={sourceFilter === option.value}
              className={cn(
                "rounded-pill border px-3 py-1 text-xs font-medium transition duration-DEFAULT",
                sourceFilter === option.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-text-secondary hover:border-border-hover hover:text-text",
              )}
            >
              {option.label}
            </button>
          ))}
          <span className="text-xs text-text-secondary">
            {stats.agreed} timestamp{stats.agreed === 1 ? "" : "s"} flagged by Isolation Forest and
            Z-Score
          </span>
        </div>
      ) : null}

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 px-5 py-16 text-center">
          <Typography variant="h2" className="text-base">
            No anomalies to show
          </Typography>
          <Typography variant="bodySmall" as="p">
            {sourceFilter === "both"
              ? "No timestamp was flagged by both methods on this day."
              : sourceFilter === "single"
                ? `No ${isIsolationForest ? "Isolation Forest" : "Z-Score"}-only anomalies on this day.`
                : "Both detectors ran and found nothing outside the expected range."}
          </Typography>
        </div>
      ) : (
        <>
          {groups.map((group) => {
            if (rendered >= visibleCount) return null;
            const slice = group.events.slice(0, Math.max(0, visibleCount - rendered));
            rendered += slice.length;

            return (
              <section key={group.key}>
                {group.label ? (
                  <h3 className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-surface/95 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-text-secondary backdrop-blur">
                    {group.label}
                    <Badge tone="neutral">{group.events.length}</Badge>
                  </h3>
                ) : null}
                <ul className="m-0 list-none p-0">
                  {slice.map((event) => (
                    <AnomalyRow key={`${event.timestamp}-${group.key}`} event={event} />
                  ))}
                </ul>
              </section>
            );
          })}

          {visibleCount < events.length ? (
            <div className="px-5 py-4 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((value) => value + PAGE_SIZE)}
                className="rounded-sm border border-border px-3 py-1.5 text-sm text-text-secondary transition duration-DEFAULT hover:border-border-hover hover:text-text"
              >
                Show {Math.min(PAGE_SIZE, events.length - visibleCount)} more
              </button>
            </div>
          ) : null}
        </>
      )}
    </Modal>
  );
}
