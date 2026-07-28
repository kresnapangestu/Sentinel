"use client";

import { useState } from "react";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Typography } from "@/components/atoms/Typography";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";
import { ProxyTabs } from "../ProxyTabs";
import { StatCard } from "../StatCard";
import { TrafficChart } from "../TrafficChart";
import { PackageInfoCard } from "../PackageInfoCard";
import { SecurityCard } from "../SecurityCard";
import { PromoCard } from "../PromoCard";
import { CdkRedeemCard } from "../CdkRedeemCard";
import { HelpCenterCard } from "../HelpCenterCard";
import { PricingCard } from "../PricingCard";
import { useDashboardData } from "../../hooks/useDashboardData";

/** Full "Dashboard" page composition, matching the Overview screen design. */
export function DashboardView() {
  const { data, isLoading } = useDashboardData();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  if (isLoading || !data) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
        aria-label="Loading dashboard"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <DashboardTemplate
        sidebarSlot={
          <Sidebar navItems={data.navItems} activeNavId={data.activeNavId} />
        }
        topbarSlot={
          <Topbar
            user={data.user}
            notificationCount={data.notificationCount}
            onToggleSidebar={() => setIsMobileNavOpen(true)}
          />
        }
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Typography variant="h1" className="flex items-center gap-1">
              Dashboard
              <span className="text-primary">+</span>
            </Typography>
            <Typography variant="bodySmall" as="p">
              Manage and monitor your KPI with ease.
            </Typography>
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.statCards.map((card) => (
                <StatCard key={card.id} data={card} />
              ))}
            </div>

            <TrafficChart />
          </div>
        </div>
      </DashboardTemplate>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative h-full w-72 max-w-[80vw]">
            <Sidebar navItems={data.navItems} activeNavId={data.activeNavId} />
          </div>
        </div>
      ) : null}
    </>
  );
}
