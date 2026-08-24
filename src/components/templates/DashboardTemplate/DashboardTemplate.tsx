import { ReactNode } from "react";

export interface DashboardTemplateProps {
  sidebarSlot: ReactNode;
  topbarSlot: ReactNode;
  children: ReactNode;
}

/**
 * Page-level template: owns the app shell only. The viewport is the shell, so
 * sidebar and topbar stay put and `main` is the single scroll container.
 * Sidebar, topbar and page content are injected via slots, so this template
 * is reusable for any future authenticated page.
 */
export function DashboardTemplate({
  sidebarSlot,
  topbarSlot,
  children,
}: DashboardTemplateProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden shrink-0 lg:block">{sidebarSlot}</aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="shrink-0">{topbarSlot}</header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
