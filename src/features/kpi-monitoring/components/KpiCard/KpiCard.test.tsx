import { render, screen } from "@testing-library/react";
import { KpiCard } from "./KpiCard";
import type { KpiOverviewSeries } from "../../types";

// ECharts renders to canvas, which jsdom cannot do. The chart *options* are
// covered by chart-options.test.ts; here only the card's own markup matters.
jest.mock("@/components/molecules/EChart", () => ({
  EChart: () => <div data-testid="echart" />,
}));

jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
}));

function buildSeries(overrides: Partial<KpiOverviewSeries> = {}): KpiOverviewSeries {
  return {
    kpi: "latency",
    displayName: "Latency",
    unit: "ms",
    today: Array.from({ length: 288 }, () => 50),
    latestValue: 50,
    todayPointCount: 288,
    zscore: {
      threshold: 3,
      anomaliesCount: 1,
      anomalies: [
        {
          timestamp: "2026-07-19T02:00:00.000Z",
          timeLabel: "09:00",
          slot: 108,
          sources: ["zscore"],
          severity: "high",
          anomalyScore: null,
          metrics: [
            {
              kpi: "latency",
              displayName: "Latency",
              unit: "ms",
              value: 134,
              expected: 50,
              std: 11,
              zScore: 7.3,
              threshold: 3,
              anomaly: true,
            },
          ],
        },
      ],
    },
    groundTruth: [
      {
        eventId: "GT-01",
        anomalyType: "SUDDEN_DROP",
        direction: "INCREASE",
        severity: "CRITICAL",
        startSlot: 107,
        peakSlot: 108,
        endSlot: 111,
        startLabel: "08:55",
        peakLabel: "09:00",
        endLabel: "09:15",
        clipped: false,
        description: "severe degradation",
      },
    ],
    ...overrides,
  };
}

function renderCard(series: KpiOverviewSeries) {
  return render(
    <KpiCard
      series={series}
      slots={Array.from({ length: 288 }, (_, i) => String(i))}
      todayDateLabel="Sun 19 Jul"
      isolationForestEvents={[]}
      onOpenZScore={jest.fn()}
    />,
  );
}

describe("KpiCard legend", () => {
  it("names ground truth as a labelled window, never as a detector output", () => {
    renderCard(buildSeries());

    expect(screen.getByText(/Ground truth/i)).toBeInTheDocument();
    expect(screen.getByText(/labelled window/i)).toBeInTheDocument();
  });

  it("marks detector results as predictions, distinct from ground truth", () => {
    renderCard(buildSeries());

    // Every detector entry in the key is explicitly qualified.
    expect(screen.getAllByText(/\(predicted\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Z-Score/).length).toBeGreaterThanOrEqual(1);
  });

  it("hides the ground-truth key when the day has no labelled window", () => {
    renderCard(buildSeries({ groundTruth: [] }));

    expect(screen.queryByText(/Ground truth/i)).not.toBeInTheDocument();
    // Predictions still render, so the absence is specific to ground truth.
    expect(screen.getAllByText(/\(predicted\)/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders the reading in WIB with its unit", () => {
    renderCard(buildSeries());

    expect(screen.getByText("50.00 ms")).toBeInTheDocument();
    expect(screen.getByText(/WIB/)).toBeInTheDocument();
  });
});
