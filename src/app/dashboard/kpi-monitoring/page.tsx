import type { Metadata } from "next";
import { KpiMonitoringView } from "@/features/kpi-monitoring";

export const metadata: Metadata = {
  title: "KPI Monitoring | SENTINEL",
  description: "Per-KPI readings with Z-Score and Isolation Forest anomaly detections.",
};

export default function KpiMonitoringPage() {
  return <KpiMonitoringView />;
}
