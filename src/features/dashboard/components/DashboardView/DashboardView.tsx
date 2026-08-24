"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";
import { StatCard } from "../StatCard";
import { TrafficChart } from "../TrafficChart";
import { CriticalKpiCard } from "../CriticalKpiCard";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useDashboardOverview } from "../../hooks/useDashboardOverview";
import { toStatCards } from "../../services/dashboard.service";

/** Full "Dashboard" page composition, matching the Overview screen design. */
export function DashboardView() {
  const { data, isLoading: isChromeLoading } = useDashboardData();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { range, setRange, kpi, setKPI, overview, isLoading, error } = useDashboardOverview();

  const statCards = useMemo(() => (overview ? toStatCards(overview) : []), [overview]);

  if (isChromeLoading || !data) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-label="Loading dashboard"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <DashboardTemplate
        sidebarSlot={<Sidebar navItems={data.navItems} activeNavId={data.activeNavId} />}
        topbarSlot={
          <Topbar
            user={data.user}
            notificationCount={overview?.totals.critical ?? 0}
            onToggleSidebar={() => setIsMobileNavOpen(true)}
          />
        }
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <Typography variant="h1">Overview</Typography>
            <Typography variant="bodySmall" as="p">
              KPI health and trends for the most recent reporting day.
            </Typography>
          </div>
          {overview ? (
            <Typography variant="caption">
              Reference day {overview.referenceDate} (WIB)
              {overview.zscoreThreshold !== null
                ? ` · Z-Score threshold ±${overview.zscoreThreshold.toFixed(1)}σ`
                : ""}
            </Typography>
          ) : null}
        </div>

        {overview?.detectionStatus === "degraded" ? (
          <div
            className="mb-6 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
            role="alert"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>
              Readings are current, but Z-Score detection is unavailable, so the health counts
              below are incomplete.
              {overview.detectionMessage ? ` ${overview.detectionMessage}` : ""}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col gap-6">
          {error && !overview ? (
            <Card
              className="flex flex-col items-center justify-center gap-1 py-12 text-center"
              role="alert"
            >
              <Typography variant="h2" className="text-base">
                Could not load dashboard data
              </Typography>
              <Typography variant="bodySmall" as="p">
                {error}
              </Typography>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.length > 0
                ? statCards.map((card, index) => <StatCard key={card.id} data={card} index={index} />)
                : [0, 1, 2].map((index) => (
                    <Card key={index} className="h-[184px] animate-pulse" aria-hidden="true">
                      <></>
                    </Card>
                  ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TrafficChart
                traffic={overview?.traffic ?? null}
                kpi={kpi}
                onKpiChange={setKPI}
                range={range}
                onRangeChange={setRange}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <CriticalKpiCard
              criticalKpis={overview?.criticalKpis ?? null}
              referenceDate={overview?.referenceDate ?? ""}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </DashboardTemplate>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative h-full w-72 max-w-[80vw]">
            <Sidebar navItems={data.navItems} activeNavId={data.activeNavId} collapsible={false} />
          </div>
        </div>
      ) : null}
    </>
  );
}
