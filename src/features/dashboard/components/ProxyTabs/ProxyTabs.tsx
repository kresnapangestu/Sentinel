"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import type { ProxyTab } from "../../types";

export interface ProxyTabsProps {
  tabs: ProxyTab[];
  defaultActiveId: string;
}

/** Segmented tab control. Local-only selection state (no page navigation yet). */
export function ProxyTabs({ tabs, defaultActiveId }: ProxyTabsProps) {
  const [activeId, setActiveId] = useState(defaultActiveId);

  return (
    <div
      role="tablist"
      aria-label="Proxy type"
      className="inline-flex items-center gap-1 rounded-md bg-background p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "rounded-sm px-4 py-2 text-sm font-semibold transition duration-DEFAULT",
              isActive
                ? "bg-primary text-primary-contrast shadow-sm"
                : "text-text-secondary hover:text-text",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
