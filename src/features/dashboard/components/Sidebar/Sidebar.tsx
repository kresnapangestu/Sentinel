"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Typography } from "@/components/atoms/Typography";
import { authService } from "@/features/auth";
import { Icon } from "../Icon";
import type { NavItem } from "../../types";
import { cn } from "@/utils/cn";

export interface SidebarProps {
  navItems: NavItem[];
  activeNavId: string;
  /** Mobile drawer passes false: always full width there, no fold toggle. */
  collapsible?: boolean;
}

const COLLAPSE_STORAGE_KEY = "sentinel:sidebar-collapsed";

/** Left navigation rail. Presentational: active id and items come from data. */
export function Sidebar({ navItems, activeNavId, collapsible = true }: SidebarProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await authService.logout();
    } finally {
      // The session cookie is cleared server-side regardless of network
      // outcome from the client's perspective -- always land on /login.
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!collapsible) return;
    setCollapsed(window.localStorage.getItem(COLLAPSE_STORAGE_KEY) !== "0");
  }, [collapsible]);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const isCollapsed = collapsible && collapsed;

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border bg-surface p-5 transition-[width] duration-DEFAULT",
        isCollapsed ? "w-[68px] px-3" : "w-64",
      )}
    >
      <div className={cn("mb-8 flex items-center gap-3 px-1", isCollapsed && "justify-center px-0")}>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-contrast">
          <Icon name="shield" size={18} />
        </span>
        {!isCollapsed ? (
          <div className="min-w-0">
            <Typography variant="h2" className="text-base leading-tight">
              SENTINEL
            </Typography>
            <Typography variant="caption" className="block truncate">
              Anomaly detection
            </Typography>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Dashboard sections">
        {navItems.map((item, index) => {
          const isActive = item.id === activeNavId;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              title={isCollapsed ? item.label : undefined}
              style={{ animationDelay: `${index * 40}ms` }}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                "motion-safe:animate-[fade-up_0.35s_cubic-bezier(0.16,1,0.3,1)_backwards]",
                "transition duration-DEFAULT active:scale-[0.97]",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "bg-primary text-primary-contrast shadow-sm"
                  : "text-text-secondary hover:bg-background hover:text-text",
              )}
            >
              <Icon name={item.icon} size={18} />
              {!isCollapsed ? item.label : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => void signOut()}
          disabled={isSigningOut}
          title={isCollapsed ? "Sign out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition duration-DEFAULT hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-60",
            isCollapsed && "justify-center px-0",
          )}
        >
          <Icon name="logout" size={18} />
          {!isCollapsed ? (isSigningOut ? "Signing out…" : "Sign out") : null}
        </button>

        {collapsible ? (
          <button
            type="button"
            onClick={toggle}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition duration-DEFAULT hover:bg-background hover:text-text",
              isCollapsed && "justify-center px-0",
            )}
          >
            {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!isCollapsed ? "Collapse" : null}
          </button>
        ) : null}
      </div>
    </div>
  );
}
