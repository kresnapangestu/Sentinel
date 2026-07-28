import { ReactNode } from "react";

export interface DashboardTemplateProps {
  sidebarSlot: ReactNode;
  topbarSlot: ReactNode;
  children: ReactNode;
}

/**
 * Page-level template: owns the fixed sidebar + scrollable content shell
 * only. Knows nothing about proxies/dashboard-specific data -- sidebar,
 * topbar and page content are all injected via slots, so this template
 * is reusable for any future authenticated page.
 */
export function DashboardTemplate({
  sidebarSlot,
  topbarSlot,
  children,
}: DashboardTemplateProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">{sidebarSlot}</aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10">{topbarSlot}</header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
