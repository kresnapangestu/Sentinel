"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Clock, TriangleAlert } from "lucide-react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { Sidebar, Topbar, useDashboardData } from "@/features/dashboard";
import { formatWibDayLabel } from "@/lib/wib";
import { cn } from "@/utils/cn";
import { useKpiMonitoring } from "../../hooks/useKpiMonitoring";
import { KPI_REFRESH_INTERVAL_MS } from "../../constants/kpi-monitoring.constants";
import { KpiFilters } from "../KpiFilters";
import { IsolationForestSummary } from "../IsolationForestSummary";
import { KpiCard } from "../KpiCard";
import { AnomalyDetailsModal } from "../AnomalyDetailsModal";
import type { AnomalyModalState, KpiOverviewSeries } from "../../types";

const ACTIVE_NAV_ID = "KPIMonitoring";

/** Grid columns match the selected KPI count (capped at 2) so a partial row
 * never leaves empty white space. */
const KPI_GRID_COLS: Record<1 | 2, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
};

function kpiGridClass(count: number): string {
  return KPI_GRID_COLS[Math.min(Math.max(count, 1), 2) as 1 | 2];
}

function ChartSkeleton() {
  return (
    <Card className="p-5" aria-hidden="true">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3.5 w-28 animate-pulse rounded-pill bg-background" />
          <div className="h-2.5 w-40 animate-pulse rounded-pill bg-background" />
        </div>
        <div className="h-6 w-16 animate-pulse rounded-pill bg-background" />
      </div>
      <div className="h-[240px] animate-pulse rounded-sm bg-background" />
    </Card>
  );
}

/** Full "KPI Monitoring" page composition. */
export function KpiMonitoringView() {
  const { data, isLoading: isChromeLoading } = useDashboardData();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [modal, setModal] = useState<AnomalyModalState | null>(null);

  const {
    selectedKpis,
    setSelectedKpis,
    resolvedDate,
    setReferenceDate,
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
  } = useKpiMonitoring();

  const anomalyCount = useMemo(
    () =>
      overview
        ? overview.isolationForest.anomaliesCount +
          overview.kpis.reduce((total, series) => total + series.zscore.anomaliesCount, 0)
        : 0,
    [overview],
  );

  const openIsolationForest = useCallback(() => {
    if (!overview?.isolationForest.available) return;

    setModal({
      source: "isolation-forest",
      title: "Isolation Forest anomalies",
      subtitle: `${overview.kpis.length} KPIs · ${formatWibDayLabel(overview.referenceDate)} · grouped by the KPI that drove each detection`,
      events: overview.isolationForest.anomalies,
      kpi: null,
      contamination: overview.isolationForest.contamination,
      threshold: overview.kpis[0]?.zscore.threshold ?? null,
    });
  }, [overview]);

  const openZScore = useCallback((series: KpiOverviewSeries) => {
    setModal({
      source: "zscore",
      title: `${series.displayName} · Z-Score anomalies`,
      subtitle: "Univariate detection — timestamps Isolation Forest also flagged are marked “Both methods”",
      // Only this KPI's Z-Score detections; each already reports whether
      // Isolation Forest agreed at the same timestamp.
      events: series.zscore.anomalies,
      kpi: series.kpi,
      contamination: null,
      threshold: series.zscore.threshold,
    });
  }, []);

  if (isChromeLoading || !data) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-label="Loading"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
      </div>
    );
  }

  const hasSelection = selectedKpis.length > 0;

  return (
    <>
      <DashboardTemplate
        sidebarSlot={<Sidebar navItems={data.navItems} activeNavId={ACTIVE_NAV_ID} />}
        topbarSlot={
          <Topbar
            user={data.user}
            notificationCount={anomalyCount}
            onToggleSidebar={() => setIsMobileNavOpen(true)}
          />
        }
      >
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Typography variant="h1">KPI Monitoring</Typography>
            <Typography variant="bodySmall" as="p">
              Per-KPI readings at 5-minute resolution, with Z-Score and Isolation Forest
              detections. All times WIB (Asia/Jakarta).
            </Typography>
          </div>
          {overview ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-border px-2.5 py-1 text-xs text-text-secondary">
              <Clock size={12} />
              {formatWibDayLabel(overview.referenceDate)}
              {overview.isLiveDay ? ` · live, up to ${overview.cutoffTime} WIB` : " · historical day"}
            </span>
          ) : null}
        </div>

        <div className="mb-5">
          <KpiFilters
            date={resolvedDate}
            onDateChange={setReferenceDate}
            selectedKpis={selectedKpis}
            onSelectedKpisChange={setSelectedKpis}
            zscoreThreshold={zscoreThreshold}
            onZscoreThresholdChange={setZscoreThreshold}
            contamination={contamination}
            onContaminationChange={setContamination}
            isRefreshing={isRefreshing}
            lastUpdatedAt={lastUpdatedAt}
            onRefresh={refresh}
            refreshIntervalMinutes={Math.round(KPI_REFRESH_INTERVAL_MS / 60000)}
          />
        </div>

        {overview?.detectionStatus === "degraded" ? (
          <div
            className="mb-5 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
            role="alert"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>
              KPI series are live, but anomaly detection is unavailable right now.
              {overview.detectionMessage ? ` ${overview.detectionMessage}` : ""}
            </span>
          </div>
        ) : null}

        {error && overview ? (
          <div
            className="mb-5 flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-xs text-text-secondary"
            role="status"
          >
            <TriangleAlert size={13} className="shrink-0 text-error" />
            Last refresh failed ({error}). Showing the previous result.
          </div>
        ) : null}

        {/* Sticky within `main`'s scroll container: title and filters scroll
            away, this stays pinned so the anomaly summary is always visible. */}
        <div className="sticky top-0 z-10 mb-5 bg-background pb-1">
          <IsolationForestSummary
            overview={overview}
            isLoading={isLoading}
            onOpen={openIsolationForest}
          />
        </div>

        {!hasSelection ? (
          <Card className="flex flex-col items-center justify-center gap-1 py-16 text-center">
            <Typography variant="h2" className="text-base">
              No KPI selected
            </Typography>
            <Typography variant="bodySmall" as="p">
              Pick at least one KPI above to see its comparison chart.
            </Typography>
          </Card>
        ) : isLoading && !overview ? (
          <div className={cn("grid gap-5", kpiGridClass(selectedKpis.length))}>
            {selectedKpis.map((kpi) => (
              <ChartSkeleton key={kpi} />
            ))}
          </div>
        ) : error && !overview ? (
          <Card className="flex flex-col items-center justify-center gap-2 border-error/30 py-16 text-center" role="alert">
            <AlertTriangle size={20} className="text-error" />
            <Typography variant="h2" className="text-base">
              Could not load KPI data
            </Typography>
            <Typography variant="bodySmall" as="p">
              {error}
            </Typography>
            <button
              type="button"
              onClick={refresh}
              className="mt-1 rounded-sm border border-border px-3 py-1.5 text-sm text-text-secondary transition duration-DEFAULT hover:border-border-hover hover:text-text"
            >
              Try again
            </button>
          </Card>
        ) : overview ? (
          <div
            className={cn(
              "grid gap-5 transition-opacity duration-DEFAULT",
              kpiGridClass(overview.kpis.length),
              // Slight dim while a background refresh is in flight.
              isRefreshing ? "opacity-70" : "opacity-100",
            )}
            aria-busy={isRefreshing}
          >
            {overview.kpis.map((series, index) => (
              <KpiCard
                key={series.kpi}
                series={series}
                slots={overview.slots}
                todayDateLabel={formatWibDayLabel(overview.referenceDate)}
                isolationForestEvents={overview.isolationForest.anomalies}
                onOpenZScore={openZScore}
                index={index}
              />
            ))}
          </div>
        ) : null}
      </DashboardTemplate>

      <AnomalyDetailsModal
        state={modal}
        referenceDate={overview?.referenceDate ?? resolvedDate}
        onClose={() => setModal(null)}
      />

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative h-full w-72 max-w-[80vw]">
            <Sidebar navItems={data.navItems} activeNavId={ACTIVE_NAV_ID} collapsible={false} />
          </div>
        </div>
      ) : null}
    </>
  );
}
