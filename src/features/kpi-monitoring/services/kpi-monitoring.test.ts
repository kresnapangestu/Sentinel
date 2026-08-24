import { mergeEventsForKpi } from "./kpi-monitoring.service";
import { formatContamination } from "../constants/kpi-monitoring.constants";
import type { AnomalyEvent } from "../types";

function event(slot: number, sources: AnomalyEvent["sources"], kpi = "latency"): AnomalyEvent {
  return {
    timestamp: new Date(Date.UTC(2026, 6, 19, 1, 55) + slot * 300_000).toISOString(),
    timeLabel: "08:55",
    slot,
    sources,
    severity: "high",
    anomalyScore: sources.includes("isolation-forest") ? 0.31 : null,
    metrics: [
      {
        kpi,
        displayName: kpi,
        unit: "ms",
        value: 120,
        expected: 50,
        std: 11,
        zScore: 6.1,
        threshold: 3,
        anomaly: true,
      },
    ],
  };
}

describe("mergeEventsForKpi", () => {
  it("merges both methods on the same timestamp into one marker", () => {
    const merged = mergeEventsForKpi(
      "latency",
      [event(108, ["zscore"])],
      [event(108, ["isolation-forest"])],
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].sources.sort()).toEqual(["isolation-forest", "zscore"]);
    // The Isolation Forest score survives the merge, so the tooltip keeps it.
    expect(merged[0].anomalyScore).toBe(0.31);
  });

  it("keeps distinct timestamps as separate markers, ordered by slot", () => {
    const merged = mergeEventsForKpi(
      "latency",
      [event(120, ["zscore"])],
      [event(108, ["isolation-forest"])],
    );

    expect(merged.map((e) => e.slot)).toEqual([108, 120]);
  });

  it("drops a multivariate event that does not involve this KPI", () => {
    // The Isolation Forest event carries only throughput, so it has nothing to
    // plot on the latency chart and must not borrow another KPI's value.
    const merged = mergeEventsForKpi("latency", [], [event(108, ["isolation-forest"], "throughput")]);

    expect(merged).toEqual([]);
  });

  it("narrows a multivariate event to this KPI's own metric", () => {
    const multivariate = event(108, ["isolation-forest"], "latency");
    multivariate.metrics = [
      multivariate.metrics[0],
      { ...multivariate.metrics[0], kpi: "throughput", displayName: "throughput" },
    ];

    const merged = mergeEventsForKpi("latency", [], [multivariate]);

    expect(merged[0].metrics).toHaveLength(1);
    expect(merged[0].metrics[0].kpi).toBe("latency");
  });
});

describe("formatContamination", () => {
  it("shows 'auto' verbatim -- it is a mode, not a proportion", () => {
    expect(formatContamination("auto")).toBe("auto");
  });

  it("formats a numeric proportion to 3 decimals", () => {
    expect(formatContamination(0.05)).toBe("0.050");
    expect(formatContamination(0.25)).toBe("0.250");
  });

  it("renders an absent value as a dash rather than crashing", () => {
    expect(formatContamination(null)).toBe("--");
    expect(formatContamination(undefined)).toBe("--");
  });
});
