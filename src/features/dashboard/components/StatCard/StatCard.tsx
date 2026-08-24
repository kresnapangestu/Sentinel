"use client";

import { useMemo } from "react";
import { TriangleAlert } from "lucide-react";
import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";
import { Typography } from "@/components/atoms/Typography";
import { EChart } from "@/components/molecules/EChart";
import { useTheme } from "@/hooks/useTheme";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/utils/cn";
import { Icon } from "../Icon";
import { buildSparklineOption } from "../../services/chart-options.service";
import type { StatCardData } from "../../types";

export interface StatCardProps {
  data: StatCardData;
  /** Grid position, staggers this card's reveal a beat after the previous one. */
  index?: number;
}

/**
 * One KPI health summary card. The headline count is the card's focal point;
 * the sparkline is a supporting per-hour distribution, not a second metric.
 */
export function StatCard({ data, index = 0 }: StatCardProps) {
  const { theme } = useTheme();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const sparklineOption = useMemo(
    () => buildSparklineOption(data.sparkline, theme),
    [data.sparkline, theme],
  );

  return (
    <Card
      ref={ref}
      style={{ "--stagger": index } as React.CSSProperties}
      className={cn("reveal flex flex-col p-5", isVisible && "is-visible")}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
          <Icon name={data.icon} size={18} />
        </span>
        <Typography variant="h2" className="text-sm">
          {data.title}
        </Typography>
      </div>

      <Typography variant="caption">{data.valueLabel}</Typography>
      <div className="mb-3 mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-3xl font-bold tabular-nums leading-none text-text">
          {data.value}
          <span className="text-sm font-semibold text-text-secondary">{data.unit}</span>
        </span>
        <Badge tone={data.badge.tone}>{data.badge.label}</Badge>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs leading-snug text-text-secondary">
          {/* The marker follows the badge tone -- a green check next to
              "at least one anomaly" would contradict the figure above it. */}
          <span
            className={cn(
              "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
              data.badge.tone === "error"
                ? "bg-error-soft text-error"
                : "bg-success-soft text-success",
            )}
          >
            {data.badge.tone === "error" ? (
              <TriangleAlert size={10} />
            ) : (
              <Icon name="check" size={10} />
            )}
          </span>
          {data.caption}
        </div>
        <div className="h-10 w-24 shrink-0" aria-hidden="true">
          <EChart option={sparklineOption} theme={theme} />
        </div>
      </div>
    </Card>
  );
}
