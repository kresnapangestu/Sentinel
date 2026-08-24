"use client";

import Link from "next/link";
import { ChevronRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import type { DashboardCriticalKpi } from "../../types";

export interface CriticalKpiCardProps {
  /** Gateway-ranked KPIs with at least one Z-Score anomaly on the reference day. */
  criticalKpis: DashboardCriticalKpi[] | null;
  referenceDate: string;
  isLoading: boolean;
  error: string | null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <Card className="flex flex-col p-5">{children}</Card>;
}

function Header({ count }: { count: number | null }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
          <TriangleAlert size={16} />
        </span>
        <Typography variant="h2" className="text-base">
          KPIs needing attention
        </Typography>
      </div>
      {count !== null && count > 0 ? (
        <Link
          href="/dashboard/kpi-monitoring"
          className="inline-flex items-center gap-0.5 rounded-sm text-sm font-medium text-primary transition duration-DEFAULT hover:underline"
        >
          Inspect
          <ChevronRight size={14} />
        </Link>
      ) : null}
    </div>
  );
}

/**
 * Ranks the KPIs the gateway flagged on the reference day. Reads the
 * `criticalKpis` list already returned by `/dashboard/overview` -- no extra
 * request, and the counts stay consistent with the stat cards above.
 */
export function CriticalKpiCard({
  criticalKpis,
  referenceDate,
  isLoading,
  error,
}: CriticalKpiCardProps) {
  if (error && !criticalKpis) {
    return (
      <Shell>
        <Header count={null} />
        <p className="m-0 text-sm text-text-secondary" role="alert">
          {error}
        </p>
      </Shell>
    );
  }

  if (isLoading && !criticalKpis) {
    return (
      <Shell>
        <Header count={null} />
        <div className="space-y-2" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-8 animate-pulse rounded-sm bg-background" />
          ))}
        </div>
      </Shell>
    );
  }

  if (!criticalKpis || criticalKpis.length === 0) {
    return (
      <Shell>
        <Header count={0} />
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-6 text-center">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-success-soft text-success">
            <ShieldCheck size={18} />
          </span>
          <Typography variant="bodySmall" as="p">
            No KPI exceeded its Z-Score threshold
          </Typography>
          <Typography variant="caption">Reference day {referenceDate} (WIB)</Typography>
        </div>
      </Shell>
    );
  }

  const highest = criticalKpis[0].anomaliesCount;

  return (
    <Shell>
      <Header count={criticalKpis.length} />
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {criticalKpis.map((entry) => (
          <li key={entry.kpi} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate text-sm text-text" title={entry.displayName}>
              {entry.displayName}
            </span>
            <span
              className="h-1.5 flex-1 overflow-hidden rounded-pill bg-background"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-pill bg-primary"
                style={{ width: `${Math.max(6, (entry.anomaliesCount / highest) * 100)}%` }}
              />
            </span>
            <span className="w-24 shrink-0 text-right text-sm tabular-nums text-text-secondary">
              {entry.anomaliesCount} anomal{entry.anomaliesCount === 1 ? "y" : "ies"}
            </span>
          </li>
        ))}
      </ul>
      <Typography variant="caption" as="p" className="mt-auto pt-4">
        Z-Score detections on {referenceDate} (WIB), highest first.
      </Typography>
    </Shell>
  );
}
