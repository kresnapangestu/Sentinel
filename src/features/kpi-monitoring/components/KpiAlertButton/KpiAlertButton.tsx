"use client";

import { Check, TriangleAlert } from "lucide-react";
import { cn } from "@/utils/cn";

export interface KpiAlertButtonProps {
  anomalyCount: number;
  /** Anomalies both detectors agreed on -- escalates the pill's tone. */
  agreedCount?: number;
  onClick: () => void;
  kpiName: string;
}

/**
 * Z-Score alert trigger on each KPI card. Opens the shared anomaly modal for
 * that KPI. With no anomalies it stays visible as a quiet "clear" state, so a
 * healthy KPI is distinguishable from one whose detection never ran.
 */
export function KpiAlertButton({
  anomalyCount,
  agreedCount = 0,
  onClick,
  kpiName,
}: KpiAlertButtonProps) {
  if (anomalyCount <= 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-pill border border-border px-2.5 py-1 text-xs font-medium text-text-secondary"
        title={`No Z-Score anomalies detected for ${kpiName}`}
      >
        <Check size={13} />
        Clear
      </span>
    );
  }

  const escalated = agreedCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${anomalyCount} Z-Score ${
        anomalyCount === 1 ? "anomaly" : "anomalies"
      } detected for ${kpiName}. Open details.`}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold transition duration-DEFAULT",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        escalated
          ? "bg-error-soft text-error hover:bg-error hover:text-white focus-visible:ring-error"
          : "bg-amber-500/15 text-amber-700 hover:bg-amber-500 hover:text-white focus-visible:ring-amber-500 dark:text-amber-300",
      )}
    >
      <TriangleAlert size={13} className="transition duration-DEFAULT group-hover:scale-110" />
      <span className="tabular-nums">{anomalyCount}</span>
      {escalated ? <span className="font-normal opacity-80">· {agreedCount} both</span> : null}
    </button>
  );
}
