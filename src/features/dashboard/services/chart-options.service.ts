import type { EChartsOption } from "echarts";
import type { TrafficPoint } from "../types";

export type ChartTheme = "light" | "dark";

// Mirrors src/styles/variables.css. ECharts renders to canvas/SVG, so it
// needs resolved color values -- it cannot consume CSS var() at runtime.
const PALETTE: Record<
  ChartTheme,
  { primary: string; primarySoft: string; grid: string; text: string; tooltipBg: string }
> = {
  light: {
    primary: "#9a1b3e",
    primarySoft: "rgba(154, 27, 62, 0.16)",
    grid: "#e3e4ee",
    text: "#6b7089",
    tooltipBg: "#14142b",
  },
  dark: {
    primary: "#d94569",
    primarySoft: "rgba(217, 69, 105, 0.2)",
    grid: "#35232a",
    text: "#b39aa2",
    tooltipBg: "#1c1116",
  },
};

/** Main "Account Traffic" area chart, with a highlighted point + tooltip. */
export function buildTrafficChartOption(
  points: TrafficPoint[],
  theme: ChartTheme,
  highlightIndex: number,
): EChartsOption {
  const colors = PALETTE[theme];

  return {
    grid: { left: 48, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: "category",
      data: points.map((point) => point.time),
      boundaryGap: false,
      axisLine: { lineStyle: { color: colors.grid } },
      axisTick: { show: false },
      axisLabel: { color: colors.text, fontSize: 12 },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.grid } },
      axisLabel: {
        color: colors.text,
        fontSize: 12,
        formatter: (value: number) => `${value.toFixed(1)} MB`,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: colors.tooltipBg,
      borderWidth: 0,
      textStyle: { color: "#ffffff" },
      formatter: (params) => {
        const [point] = Array.isArray(params) ? params : [params];
        const value =
          typeof point.value === "number" ? point.value : Number(point.value);
        return `${value.toFixed(1)} MB<br />${point.name ?? ""}`;
      },
    },
    series: [
      {
        type: "line",
        data: points.map((point) => point.value),
        smooth: 0.35,
        symbol: "circle",
        symbolSize: (_value: number, params) =>
          params.dataIndex === highlightIndex ? 8 : 0,
        showSymbol: true,
        itemStyle: { color: colors.primary },
        lineStyle: { color: colors.primary, width: 2.5 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.primarySoft },
              { offset: 1, color: "rgba(0,0,0,0)" },
            ],
          },
        },
        markLine:
          highlightIndex >= 0
            ? {
                symbol: "none",
                silent: true,
                lineStyle: { color: colors.grid, type: "dashed" },
                data: [{ xAxis: highlightIndex }],
                label: { show: false },
              }
            : undefined,
      },
    ],
  };
}

/** Tiny inline sparkline used inside each stat card. */
export function buildSparklineOption(
  values: number[],
  theme: ChartTheme,
): EChartsOption {
  const colors = PALETTE[theme];

  return {
    grid: { left: 0, right: 0, top: 4, bottom: 0 },
    xAxis: { type: "category", show: false, data: values.map((_, i) => i) },
    yAxis: { type: "value", show: false },
    tooltip: { show: false },
    series: [
      {
        type: "line",
        data: values,
        smooth: 0.4,
        symbol: "none",
        lineStyle: { color: colors.primary, width: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.primarySoft },
              { offset: 1, color: "rgba(0,0,0,0)" },
            ],
          },
        },
      },
    ],
  };
}
