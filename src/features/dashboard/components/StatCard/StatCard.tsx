"use client";

import { useMemo } from "react";
import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";
import { Typography } from "@/components/atoms/Typography";
import { EChart } from "@/components/molecules/EChart";
import { useTheme } from "@/hooks/useTheme";
import { Icon } from "../Icon";
import { buildSparklineOption } from "../../services/chart-options.service";
import type { StatCardData } from "../../types";

export interface StatCardProps {
  data: StatCardData;
}

/** One "Total KPI / Unlimited Resi / ISP Proxies" summary card. */
export function StatCard({ data }: StatCardProps) {
  const { theme } = useTheme();
  const sparklineOption = useMemo(
    () => buildSparklineOption(data.sparkline, theme),
    [data.sparkline, theme],
  );

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary">
          <Icon name={data.icon} size={18} />
        </span>
        <Typography variant="h2" className="text-sm">
          {data.title}
        </Typography>
      </div>

      <Typography variant="caption">{data.priceLabel}</Typography>
      <div className="mb-2 mt-1 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-bold text-text">
          {data.price}
          <span className="text-sm font-semibold text-text-secondary">
            {data.unit}
          </span>
        </span>
        <Badge tone={data.trend.direction === "down" ? "success" : "error"}>
          {data.trend.value}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-success-soft text-success">
            <Icon name="check" size={10} />
          </span>
          {data.caption}
        </div>
        <div className="h-10 w-24">
          <EChart option={sparklineOption} theme={theme} />
        </div>
      </div>
    </Card>
  );
}
