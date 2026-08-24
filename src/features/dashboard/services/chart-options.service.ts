import type { EChartsOption } from "echarts";
import type { TrafficPoint } from "../types";

export type ChartTheme = "light" | "dark";

// Mirrors src/styles/variables.css. ECharts renders to canvas/SVG, so it
// needs resolved color values -- it cannot consume CSS var() at runtime.
const PALETTE: Record<
  ChartTheme,
  {
    primary: string;
    primarySoft: string;
    grid: string;
    text: string;
    tooltipBg: string;
    /** KPI Monitoring series. Distinct from `primary` so anomaly markers (warm
     * hues) stay legible against it without relying on a red/green pair. */
    today: string;
    todaySoft: string;
    anomalyZScore: string;
    anomalyIsolationForest: string;
    anomalyBoth: string;
    /** Ground-truth band: a neutral slate, deliberately outside the warm
     * anomaly-marker hues so a label is never mistaken for a prediction. */
    groundTruthBand: string;
    groundTruthEdge: string;
    groundTruthLabel: string;
  }
> = {
  light: {
    primary: "#9a1b3e",
    primarySoft: "rgba(154, 27, 62, 0.16)",
    grid: "#e3e4ee",
    text: "#6b7089",
    tooltipBg: "#14142b",
    today: "#4338ca",
    todaySoft: "rgba(67, 56, 202, 0.14)",
    anomalyZScore: "#d97706",
    anomalyIsolationForest: "#7c3aed",
    anomalyBoth: "#be123c",
    groundTruthBand: "rgba(71, 85, 105, 0.13)",
    groundTruthEdge: "rgba(71, 85, 105, 0.45)",
    groundTruthLabel: "#475569",
  },
  dark: {
    primary: "#d94569",
    primarySoft: "rgba(217, 69, 105, 0.2)",
    grid: "#35232a",
    text: "#b39aa2",
    tooltipBg: "#1c1116",
    today: "#818cf8",
    todaySoft: "rgba(129, 140, 248, 0.18)",
    anomalyZScore: "#fbbf24",
    // Cyan, deliberately outside the indigo "today" line's hue family so the
    // Isolation Forest marker never blends into it against a dark background.
    anomalyIsolationForest: "#22d3ee",
    anomalyBoth: "#fb7185",
    groundTruthBand: "rgba(148, 163, 184, 0.16)",
    groundTruthEdge: "rgba(148, 163, 184, 0.5)",
    groundTruthLabel: "#94a3b8",
  },
};

/**
 * Decimal places that keep adjacent axis ticks distinguishable. A KPI like
 * availability spans ~0.2% across a whole day, so a fixed 1-decimal axis
 * renders several ticks with identical labels.
 */
function axisPrecision(values: number[]): number {
  if (values.length === 0) return 1;

  const spread = Math.max(...values) - Math.min(...values);
  if (spread === 0) return 2;
  if (spread >= 10) return 0;
  if (spread >= 1) return 1;
  if (spread >= 0.1) return 2;
  return 3;
}

/** KPI trend area chart, with the latest data point highlighted + tooltip. */
export function buildTrafficChartOption(
  points: TrafficPoint[],
  theme: ChartTheme,
  highlightIndex: number,
  unit: string | null,
): EChartsOption {
  const colors = PALETTE[theme];
  const precision = axisPrecision(points.map((point) => point.value));

  return {
    grid: { left: 68, right: 24, top: 24, bottom: 28 },
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
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.grid } },
      axisLabel: {
        color: colors.text,
        fontSize: 12,
        formatter: (value: number) =>
          unit ? `${value.toFixed(precision)} ${unit}` : value.toFixed(precision),
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
        return `${formatValue(value, unit)}<br />${point.name ?? ""}`;
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
                lineStyle: { color: colors.primary, type: "dashed", opacity: 0.55 },
                data: [{ xAxis: highlightIndex }],
                label: {
                  show: true,
                  position: "end",
                  rotate: 0,
                  formatter: "Latest",
                  color: colors.primary,
                  fontSize: 10,
                  fontWeight: "bold",
                },
              }
            : undefined,
      },
    ],
  };
}

export type AnomalyMarkerKind = "zscore" | "isolation-forest" | "both";

export interface AnomalyMarker {
  /** 0..287 index into `slots`. */
  slot: number;
  value: number;
  kind: AnomalyMarkerKind;
  /** Extra tooltip line, e.g. "z=3.8 · score 0.21". */
  detail: string;
}

/**
 * A labelled anomaly window. Rendered as a shaded background band -- a
 * deliberately different visual channel from the point markers used for
 * detector output, so the chart cannot suggest that ground truth came from
 * Z-Score or Isolation Forest.
 */
export interface GroundTruthBand {
  eventId: string;
  /** Inclusive slot bounds within the rendered day. */
  startSlot: number;
  endSlot: number;
  /** Short caption, e.g. "GT-01 · sudden drop". */
  label: string;
  /** Tooltip line, e.g. "08:55 - 09:15 WIB · peak 09:00". */
  detail: string;
}

export interface KpiSeriesChartInput {
  /** X-axis labels ("00:00" .. "23:55"). */
  slots: string[];
  /** Values per slot; null past the WIB cutoff or where data is missing. */
  today: (number | null)[];
  todayDateLabel: string;
  unit: string | null;
  anomalies: AnomalyMarker[];
  /** Ground-truth windows for this KPI. Reference labels, never predictions. */
  groundTruth?: GroundTruthBand[];
}

export const MARKER_STYLE: Record<
  AnomalyMarkerKind,
  { symbol: string; size: number; label: string }
> = {
  zscore: { symbol: "diamond", size: 11, label: "Z-Score" },
  "isolation-forest": { symbol: "triangle", size: 11, label: "Isolation Forest" },
  both: { symbol: "pin", size: 16, label: "Both methods" },
};

export const TODAY_SERIES_NAME = "Reading";

/**
 * Resolved colors for the KPI chart, so the card's HTML legend and the canvas
 * always agree. ECharts cannot read CSS `var()` at runtime, so both sides read
 * the same resolved palette instead.
 */
export function getKpiChartColors(theme: ChartTheme) {
  const colors = PALETTE[theme];
  return {
    today: colors.today,
    zscore: colors.anomalyZScore,
    "isolation-forest": colors.anomalyIsolationForest,
    both: colors.anomalyBoth,
    groundTruth: colors.groundTruthBand,
    groundTruthEdge: colors.groundTruthEdge,
  };
}

/** Series name of the ground-truth band, so the tooltip can label it plainly. */
export const GROUND_TRUTH_SERIES_NAME = "Ground truth (labelled)";

/** The subset of an ECharts tooltip param this chart reads. */
interface TooltipItem {
  axisValue?: string;
  axisIndex?: number;
  dataIndex?: number;
  seriesName?: string;
  marker?: string;
  value?: unknown;
  data?: unknown;
}

function formatValue(value: number, unit: string | null): string {
  return unit ? `${value.toFixed(2)} ${unit}` : value.toFixed(2);
}

/**
 * KPI Monitoring chart: one KPI over the reference day at 5-minute resolution,
 * with anomaly markers layered on the line. Gaps stay as gaps -- `connectNulls`
 * is off so a missing interval is visible instead of being bridged with an
 * invented value.
 */
export function buildKpiSeriesChartOption(
  input: KpiSeriesChartInput,
  theme: ChartTheme,
): EChartsOption {
  const colors = PALETTE[theme];
  const { slots, today, unit } = input;
  const precision = axisPrecision(today.filter((value): value is number => value !== null));

  const markerSeries = (["both", "isolation-forest", "zscore"] as const)
    .map((kind) => {
      const points = input.anomalies.filter((anomaly) => anomaly.kind === kind);
      if (points.length === 0) return null;

      const color =
        kind === "both"
          ? colors.anomalyBoth
          : kind === "isolation-forest"
            ? colors.anomalyIsolationForest
            : colors.anomalyZScore;

      return {
        type: "scatter" as const,
        name: MARKER_STYLE[kind].label,
        data: points.map((anomaly) => ({
          value: [anomaly.slot, anomaly.value],
          detail: anomaly.detail,
        })),
        symbol: MARKER_STYLE[kind].symbol,
        symbolSize: MARKER_STYLE[kind].size,
        itemStyle: {
          color,
          borderColor: theme === "dark" ? "#17172b" : "#ffffff",
          borderWidth: 1.5,
        },
        z: 5,
      };
    })
    .filter((series): series is NonNullable<typeof series> => series !== null);

  // Ground truth rides on its own zero-height series drawn *behind* the line
  // (z below the reading and the markers). markArea spans the labelled window
  // instead of dotting individual points, which is what keeps it readable as
  // "this interval was anomalous" rather than "these points were flagged".
  const bands = input.groundTruth ?? [];
  const groundTruthSeries =
    bands.length > 0
      ? [
          {
            type: "line" as const,
            name: GROUND_TRUTH_SERIES_NAME,
            data: [],
            silent: true,
            z: 1,
            markArea: {
              silent: true,
              itemStyle: {
                color: colors.groundTruthBand,
                borderColor: colors.groundTruthEdge,
                borderWidth: 1,
                borderType: "dashed" as const,
              },
              label: {
                show: true,
                // insideTopLeft anchors the caption to the window's own start
                // instead of centring it, so a band that runs to the right
                // edge of the grid still renders its label in full.
                position: "insideTopLeft" as const,
                color: colors.groundTruthLabel,
                fontSize: 10,
                fontWeight: "bold" as const,
                padding: [2, 3],
              },
              // ECharts types markArea.data as a 2-tuple (start, end) per area,
              // so the pair is annotated rather than inferred as an array.
              data: bands.map(
                (band): [{ xAxis: number; name: string }, { xAxis: number }] => [
                  { xAxis: band.startSlot, name: band.label },
                  { xAxis: band.endSlot },
                ],
              ),
            },
          },
        ]
      : [];

  // Newest slot that actually reported: drives the "latest data" marker, so it
  // follows the API instead of the clock.
  const latestSlot = today.reduce<number>(
    (latest, value, slot) => (value === null || value === undefined ? latest : slot),
    -1,
  );

  // Series names stay short; the date they refer to lives in the card's own
  // legend and in the tooltip, which keeps the canvas free of wrapped labels.
  const seriesDate: Record<string, string> = {
    [TODAY_SERIES_NAME]: input.todayDateLabel,
  };

  return {
    animationDuration: 240,
    grid: { left: 52, right: 16, top: 26, bottom: 28 },
    legend: { show: false },
    xAxis: {
      type: "category",
      data: slots,
      boundaryGap: false,
      axisLine: { lineStyle: { color: colors.grid } },
      axisTick: { show: false },
      axisLabel: {
        color: colors.text,
        fontSize: 11,
        // 288 slots would collide; one label per 3 hours reads cleanly even in
        // the narrowest (mobile) card width.
        interval: (index: number) => index % 36 === 0,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.grid, type: "dashed" } },
      axisLabel: {
        color: colors.text,
        fontSize: 11,
        formatter: (value: number) => value.toFixed(precision),
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: colors.tooltipBg,
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: "#ffffff", fontSize: 12 },
      axisPointer: { type: "line", lineStyle: { color: colors.grid } },
      // `unknown` keeps this assignable to ECharts' formatter type while still
      // reading the fields the axis tooltip actually provides.
      formatter: (params: unknown) => {
        const items = (Array.isArray(params) ? params : [params]) as TooltipItem[];
        const time = items[0]?.axisValue ?? "";
        const lines = items
          .filter((item) => item.value !== null && item.value !== undefined)
          .map((item) => {
            const raw = Array.isArray(item.value) ? item.value[1] : item.value;
            const numeric = typeof raw === "number" ? raw : Number(raw);
            if (Number.isNaN(numeric)) return null;

            const detail =
              typeof item.data === "object" && item.data !== null && "detail" in item.data
                ? String((item.data as { detail?: string }).detail ?? "")
                : "";

            const date = seriesDate[item.seriesName ?? ""];

            return `${item.marker ?? ""} ${item.seriesName ?? ""}${
              date ? ` <span style="opacity:.7">${date}</span>` : ""
            } <b>${formatValue(numeric, unit)}</b>${
              detail ? `<br /><span style="opacity:.75">${detail}</span>` : ""
            }`;
          })
          .filter((line): line is string => line !== null);

        // Hovering inside a labelled window states the ground truth in words,
        // clearly separated from the detector lines above it.
        const slot = items.find((item) => typeof item.dataIndex === "number")?.dataIndex ?? -1;
        const covering = bands.filter(
          (band) => slot >= band.startSlot && slot <= band.endSlot,
        );
        const truth = covering
          .map(
            (band) =>
              `<span style="opacity:.85">◼ ${GROUND_TRUTH_SERIES_NAME}</span> <b>${band.label}</b>` +
              `<br /><span style="opacity:.7">${band.detail}</span>`,
          )
          .join("<br />");

        return (
          `<div style="font-weight:600;margin-bottom:4px">${time} WIB</div>` +
          lines.join("<br />") +
          (truth ? `${lines.length > 0 ? "<br />" : ""}${truth}` : "")
        );
      },
    },
    series: [
      {
        type: "line",
        name: TODAY_SERIES_NAME,
        data: today,
        smooth: 0.2,
        symbol: "none",
        connectNulls: false,
        lineStyle: { color: colors.today, width: 2.5 },
        itemStyle: { color: colors.today },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.todaySoft },
              { offset: 1, color: "rgba(0,0,0,0)" },
            ],
          },
        },
        markLine:
          latestSlot >= 0
            ? {
                symbol: ["none", "circle"],
                symbolSize: 5,
                silent: true,
                lineStyle: { color: colors.today, type: "dashed", width: 1.25, opacity: 0.7 },
                data: [{ xAxis: latestSlot }],
                label: {
                  show: true,
                  position: "end",
                  rotate: 0,
                  // Time omitted: it is already on the card header, and a
                  // "Latest 23:55" label clips against the grid's right edge.
                  formatter: "Latest",
                  color: colors.today,
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: [2, 4],
                },
              }
            : undefined,
        z: 3,
      },
      ...markerSeries,
      ...groundTruthSeries,
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
