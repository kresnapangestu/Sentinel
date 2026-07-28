import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | SENTINEL",
  description: "Manage, monitor, and optimize your proxies with ease.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
