"use client";

import { useMemo } from "react";
import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
import { EChart } from "@/components/molecules/EChart";
import { useTheme } from "@/hooks/useTheme";
import { Icon } from "../Icon";
import { useTrafficRange } from "../../hooks/useTrafficRange";
import { buildTrafficChartOption } from "../../services/chart-options.service";
import { TRAFFIC_RANGE_OPTIONS } from "../../constants/dashboard.constants";
import { cn } from "@/utils/cn";
import Autocomplete from "@/components/atoms/Autocomplete";
import { KPI_OPTIONS } from "../../types";

/** "KPI Performance Trends" chart card, with 24h/7d/30d range switching. */
export function TrafficChart() {
  const { theme } = useTheme();
  const { kpi, setKPI, range, setRange, summary, isLoading } =
    useTrafficRange();

  const option = useMemo(() => {
    if (!summary) return null;
    return buildTrafficChartOption(
      summary.points,
      theme,
      summary.highlight.index,
    );
  }, [summary, theme]);

  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
            <Icon name="traffic" size={16} />
          </span>
          <Typography variant="h2" className="text-base">
            KPI Performance Trends
          </Typography>
        </div>
        <div className="flex gap-2 items-center">
          <Autocomplete
            value={kpi}
            onChange={setKPI}
            placeholder="Select KPI"
            options={KPI_OPTIONS}
          />

          <div className="inline-flex items-center gap-1 rounded-md bg-background p-1">
            {TRAFFIC_RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-sm font-semibold transition duration-DEFAULT",
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

      <div className="mb-4 flex gap-8">
        <div>
          <Typography variant="h1" className="text-xl">
            {summary?.peakLabel ?? "--"}
          </Typography>
          <Typography variant="caption">Peak</Typography>
        </div>
        <div>
          <Typography variant="h1" className="text-xl">
            {summary?.averageLabel ?? "--"}
          </Typography>
          <Typography variant="caption">Average</Typography>
        </div>
      </div>

      <div className="h-[280px]">
        {isLoading || !option ? (
          <div
            className="flex h-full items-center justify-center text-sm text-text-secondary"
            role="status"
          >
            Loading traffic data…
          </div>
        ) : (
          <EChart option={option} theme={theme} />
        )}
      </div>
    </Card>
  );
}
