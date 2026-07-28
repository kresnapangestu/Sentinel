"use client";

import { useEffect, useRef } from "react";
import type { EChartsOption } from "echarts";
import { cn } from "@/utils/cn";

export interface EChartProps {
  option: EChartsOption;
  className?: string;
  theme?: "light" | "dark";
}

/**
 * Generic Apache ECharts wrapper. This is the ONLY component in the app
 * that touches the `echarts` package directly -- every chart (current or
 * future) renders through this, so chart config always stays isolated
 * from rendering/lifecycle concerns.
 */
export function EChart({ option, className, theme }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<import("echarts").ECharts | null>(null);

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;

    void import("echarts").then((echarts) => {
      if (disposed || !containerRef.current) return;

      const instance = echarts.init(containerRef.current, theme);
      chartRef.current = instance;
      instance.setOption(option);

      resizeObserver = new ResizeObserver(() => instance.resize());
      resizeObserver.observe(containerRef.current);
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={containerRef} className={cn("h-full w-full", className)} />;
}
