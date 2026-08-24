import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Overview | SENTINEL",
  description: "KPI health counts and performance trends for the most recent reporting day.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
