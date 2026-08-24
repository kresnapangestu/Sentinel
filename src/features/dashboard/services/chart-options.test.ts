import type { EChartsOption, LineSeriesOption, ScatterSeriesOption } from "echarts";
import {
  buildKpiSeriesChartOption,
  getKpiChartColors,
  GROUND_TRUTH_SERIES_NAME,
  TODAY_SERIES_NAME,
  type AnomalyMarker,
  type GroundTruthBand,
} from "./chart-options.service";

const slots = Array.from({ length: 288 }, (_, i) => {
  const h = String(Math.floor((i * 5) / 60)).padStart(2, "0");
  const m = String((i * 5) % 60).padStart(2, "0");
  return `${h}:${m}`;
});

const today = Array.from({ length: 288 }, (_, i) => 50 + (i % 7));

const band: GroundTruthBand = {
  eventId: "GT-01",
  startSlot: 107,
  endSlot: 111,
  label: "GT-01",
  detail: "sudden drop · 08:55–09:15 WIB · peak 09:00",
};

const marker: AnomalyMarker = { slot: 108, value: 120, kind: "zscore", detail: "z 4.2" };

function build(overrides: Partial<Parameters<typeof buildKpiSeriesChartOption>[0]> = {}) {
  return buildKpiSeriesChartOption(
    {
      slots,
      today,
      todayDateLabel: "Sun 19 Jul",
      unit: "ms",
      anomalies: [marker],
      groundTruth: [band],
      ...overrides,
    },
    "light",
  );
}

const seriesOf = (option: EChartsOption) =>
  (Array.isArray(option.series) ? option.series : [option.series]) as Array<
    LineSeriesOption | ScatterSeriesOption
  >;

describe("KPI chart options", () => {
  it("renders ground truth as a background band, not as data points", () => {
    const groundTruth = seriesOf(build()).find((s) => s?.name === GROUND_TRUTH_SERIES_NAME) as
      | LineSeriesOption
      | undefined;

    expect(groundTruth).toBeDefined();
    // No data points: a labelled window must never add a value to the line.
    expect(groundTruth!.data).toEqual([]);
    expect(groundTruth!.markArea?.data).toEqual([
      [{ xAxis: 107, name: "GT-01" }, { xAxis: 111 }],
    ]);
  });

  it("draws ground truth behind the reading and the prediction markers", () => {
    const series = seriesOf(build());
    const z = (name: string) => series.find((s) => s?.name === name)?.z;

    expect(z(GROUND_TRUTH_SERIES_NAME)).toBeLessThan(z(TODAY_SERIES_NAME)!);
    expect(z(TODAY_SERIES_NAME)).toBeLessThan(z("Z-Score")!);
  });

  it("keeps ground truth visually distinct from every prediction colour", () => {
    const colors = getKpiChartColors("light");

    expect(colors.groundTruth).not.toBe(colors.zscore);
    expect(colors.groundTruth).not.toBe(colors["isolation-forest"]);
    expect(colors.groundTruth).not.toBe(colors.both);
    expect(colors.groundTruth).not.toBe(colors.today);
  });

  it("omits the ground-truth series entirely when there are no labelled windows", () => {
    const names = seriesOf(build({ groundTruth: [] })).map((s) => s?.name);
    expect(names).not.toContain(GROUND_TRUTH_SERIES_NAME);
    // The prediction markers must still render.
    expect(names).toContain("Z-Score");
  });

  it("renders a prediction marker as a point series at its own slot", () => {
    const zscore = seriesOf(build()).find((s) => s?.name === "Z-Score") as ScatterSeriesOption;

    expect(zscore.type).toBe("scatter");
    expect(zscore.data).toEqual([{ value: [108, 120], detail: "z 4.2" }]);
  });

  it("leaves gaps unconnected so a missing interval stays visible", () => {
    const withGap = [...today];
    withGap[10] = null as unknown as number;

    const line = seriesOf(build({ today: withGap })).find(
      (s) => s?.name === TODAY_SERIES_NAME,
    ) as LineSeriesOption;

    expect(line.connectNulls).toBe(false);
  });
});
