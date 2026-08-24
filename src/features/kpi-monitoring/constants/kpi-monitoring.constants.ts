import type { KPIKey } from "@/features/dashboard/types";
import type { Contamination } from "../types";

export const DEFAULT_SELECTED_KPIS: KPIKey[] = [
  "throughput",
  "latency",
  "packet-loss",
  "availability",
  "jitter",
  "prb-utilization",
  "active-users",
  "rrc-success-rate",
  "handover-success-rate",
  "call-drop-rate",
];

/**
 * Single source of truth for the dashboard polling cadence (5 minutes, the
 * KPI sampling interval). Nothing else in the app may define its own timer --
 * useKpiMonitoring owns the only interval and reads it from here.
 */
export const KPI_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

/**
 * The reference day is resolved by the gateway (the WIB day of the newest
 * reading) rather than hardcoded here: the seeded dataset is anchored to a
 * fixed window for reproducible thesis evidence, while a live feed resolves to
 * the current WIB day. The date picker starts empty and is filled in from the
 * first API response.
 */
export const AUTO_REFERENCE_DATE = "";

export const KPI_METADATA: Record<KPIKey, { title: string; subtitle: string }> =
  {
    throughput: {
      title: "Throughput",
      subtitle: "Aggregate cell throughput (Mbps)",
    },
    latency: {
      title: "Latency",
      subtitle: "Average round-trip latency (ms)",
    },
    "packet-loss": {
      title: "Packet Loss",
      subtitle: "Dropped packets percentage",
    },
    availability: {
      title: "Availability",
      subtitle: "Network availability percentage",
    },
    jitter: {
      title: "Jitter",
      subtitle: "Packet delay variation (ms)",
    },
    "prb-utilization": {
      title: "PRB Utilization",
      subtitle: "Physical Resource Block utilization",
    },
    "active-users": {
      title: "Active Users",
      subtitle: "Concurrently connected users",
    },
    "rrc-success-rate": {
      title: "RRC Success Rate",
      subtitle: "RRC connection setup success rate",
    },
    "handover-success-rate": {
      title: "Handover Success Rate",
      subtitle: "Handover success rate",
    },
    "call-drop-rate": {
      title: "Call Drop Rate",
      subtitle: "Dropped call percentage",
    },
  };

/**
 * Renders the Isolation Forest contamination for display. "auto" is a mode,
 * not a proportion, so it is shown verbatim rather than coerced to a number.
 */
export function formatContamination(
  value: Contamination | null | undefined,
): string {
  if (value === null || value === undefined) return "--";
  return value === "auto" ? "auto" : value.toFixed(3);
}
