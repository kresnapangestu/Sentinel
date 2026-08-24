"use client";

import { ChevronRight, Info, Sigma, TreePine, Users } from "lucide-react";
import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/utils/cn";
import { formatContamination } from "../../constants/kpi-monitoring.constants";
import type { KpiOverview } from "../../types";

export interface IsolationForestSummaryProps {
  overview: KpiOverview | null;
  isLoading: boolean;
  /** Opens the multivariate anomaly details modal. */
  onOpen: () => void;
}

function Tile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-background text-text-secondary">
        {icon}
      </span>
      <div className="min-w-0">
        <Typography variant="caption">{label}</Typography>
        <p className="m-0 text-lg font-semibold tabular-nums leading-tight text-text">{value}</p>
        {hint ? <p className="m-0 truncate text-xs text-text-secondary">{hint}</p> : null}
      </div>
    </div>
  );
}

/**
 * Anomaly summary strip. The Isolation Forest panel is the primary action --
 * clicking it opens the multivariate anomaly details for the current filter.
 */
export function IsolationForestSummary({
  overview,
  isLoading,
  onOpen,
}: IsolationForestSummaryProps) {
  if (isLoading && !overview) {
    return (
      <Card className="grid grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-3 bg-surface px-5 py-4">
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-sm bg-background" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-20 animate-pulse rounded-pill bg-background" />
              <div className="h-4 w-12 animate-pulse rounded-pill bg-background" />
            </div>
          </div>
        ))}
      </Card>
    );
  }

  const isolationForest = overview?.isolationForest;
  const available = isolationForest?.available ?? false;
  const anomalies = isolationForest?.anomaliesCount ?? 0;
  const agreed =
    isolationForest?.anomalies.filter((event) => event.sources.length > 1).length ?? 0;
  const zscoreTotal =
    overview?.kpis.reduce((total, series) => total + series.zscore.anomaliesCount, 0) ?? 0;

  return (
    <Card className="grid grid-cols-1 gap-px overflow-hidden bg-border sm:grid-cols-3">
      <button
        type="button"
        onClick={onOpen}
        disabled={!available}
        aria-label={
          available
            ? `${anomalies} Isolation Forest anomalies. Open details.`
            : "Isolation Forest results unavailable"
        }
        className={cn(
          "group flex items-center gap-3 bg-surface px-5 py-4 text-left transition duration-DEFAULT",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
          available ? "cursor-pointer hover:bg-primary-soft/40" : "cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm transition duration-DEFAULT",
            available
              ? "bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-contrast"
              : "bg-background text-text-secondary",
          )}
        >
          <TreePine size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <Typography variant="caption">Isolation Forest · multivariate</Typography>
          <p className="m-0 flex items-baseline gap-2 text-lg font-semibold leading-tight text-text">
            <span className="tabular-nums">{available ? anomalies : "--"}</span>
            <span className="text-xs font-normal text-text-secondary">
              {available ? "anomalies detected" : "unavailable"}
            </span>
          </p>
          {available ? (
            <p className="m-0 truncate text-xs text-text-secondary">
              {overview?.kpis.length} KPIs · contamination{" "}
              {formatContamination(isolationForest?.contamination)}
            </p>
          ) : (
            <p className="m-0 flex items-center gap-1 truncate text-xs text-text-secondary">
              <Info size={11} className="shrink-0" />
              {isolationForest?.reason ?? "No result for this selection."}
            </p>
          )}
        </div>

        {available ? (
          <ChevronRight
            size={18}
            className="shrink-0 text-text-secondary transition duration-DEFAULT group-hover:translate-x-0.5 group-hover:text-primary"
          />
        ) : null}
      </button>

      <Tile
        icon={<Sigma size={18} />}
        label="Z-Score · univariate"
        value={String(zscoreTotal)}
        hint={`across ${overview?.kpis.length ?? 0} selected KPI${
          (overview?.kpis.length ?? 0) === 1 ? "" : "s"
        }`}
      />

      <Tile
        icon={<Users size={18} />}
        label="Both methods agree"
        value={String(agreed)}
        hint={agreed > 0 ? "timestamps flagged twice" : "no overlapping detections"}
      />
    </Card>
  );
}
