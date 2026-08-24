"use client";

import { useMemo } from "react";
import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { EChart } from "@/components/molecules/EChart";
import { useTheme } from "@/hooks/useTheme";
import Autocomplete from "@/components/atoms/Autocomplete";
import { cn } from "@/utils/cn";
import { Icon } from "../Icon";
import { buildTrafficChartOption } from "../../services/chart-options.service";
import { formatKpiValue } from "../../services/dashboard.service";
import { TRAFFIC_RANGE_OPTIONS } from "../../constants/dashboard.constants";
import { KPI_OPTIONS, type DashboardTraffic, type KPIKey, type TrafficRangeKey } from "../../types";

export interface TrafficChartProps {
  traffic: DashboardTraffic | null;
  kpi: KPIKey;
  onKpiChange: (kpi: KPIKey) => void;
  range: TrafficRangeKey;
  onRangeChange: (range: TrafficRangeKey) => void;
  isLoading: boolean;
  error: string | null;
}

/** KPI trend chart card, with 24h/7d/30d range switching. */
export function TrafficChart({
  traffic,
  kpi,
  onKpiChange,
  range,
  onRangeChange,
  isLoading,
  error,
}: TrafficChartProps) {
  const { theme } = useTheme();

  const option = useMemo(() => {
    if (!traffic || traffic.points.length === 0) return null;
    return buildTrafficChartOption(
      traffic.points,
      theme,
      traffic.latest?.index ?? -1,
      traffic.unit,
    );
  }, [traffic, theme]);

  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
            <Icon name="traffic" size={16} />
          </span>
          <Typography variant="h2" className="text-base">
            KPI trend
          </Typography>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Autocomplete
            value={kpi}
            onChange={(value) => onKpiChange(value as KPIKey)}
            placeholder="Select KPI"
            options={KPI_OPTIONS}
          />

          <div
            className="inline-flex items-center gap-1 rounded-md bg-background p-1"
            role="group"
            aria-label="Trend range"
          >
            {TRAFFIC_RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onRangeChange(option.key)}
                aria-pressed={range === option.key}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-sm font-semibold transition duration-DEFAULT",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  range === option.key
                    ? "bg-primary text-primary-contrast shadow-sm"
                    : "text-text-secondary hover:text-text",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <dl className="mb-5 flex flex-wrap gap-x-10 gap-y-3">
        <div>
          <dd className="m-0 text-xl font-semibold tabular-nums leading-tight text-text">
            {formatKpiValue(traffic?.peak ?? null, traffic?.unit ?? null)}
          </dd>
          <dt className="text-xs text-text-secondary">Peak</dt>
        </div>
        <div>
          <dd className="m-0 text-xl font-semibold tabular-nums leading-tight text-text">
            {formatKpiValue(traffic?.average ?? null, traffic?.unit ?? null)}
          </dd>
          <dt className="text-xs text-text-secondary">Mean</dt>
        </div>
        {traffic?.latest ? (
          <div>
            <dd className="m-0 text-xl font-semibold tabular-nums leading-tight text-text">
              {formatKpiValue(traffic.latest.value, traffic.unit)}
            </dd>
            <dt className="text-xs text-text-secondary">Latest · {traffic.latest.time} WIB</dt>
          </div>
        ) : null}
      </dl>

      <div className="h-[280px]">
        {error && !option ? (
          <div className="flex h-full items-center justify-center text-sm text-error" role="alert">
            {error}
          </div>
        ) : isLoading && !option ? (
          <div
            className="flex h-full items-center justify-center text-sm text-text-secondary"
            role="status"
          >
            Loading KPI trend…
          </div>
        ) : option ? (
          <EChart option={option} theme={theme} />
        ) : (
          <div className="flex h-full items-center justify-center px-5 text-center text-sm text-text-secondary">
            No readings for this KPI in the selected range.
          </div>
        )}
      </div>
    </Card>
  );
}
