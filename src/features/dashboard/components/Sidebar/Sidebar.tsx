import Link from "next/link";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Icon } from "../Icon";
import type { NavItem } from "../../types";
import { cn } from "@/utils/cn";

export interface SidebarProps {
  navItems: NavItem[];
  activeNavId: string;
}

/** Left navigation rail. Presentational: active id and items come from data. */
export function Sidebar({ navItems, activeNavId }: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-surface p-5">
      <div className="flex items-center gap-3 px-1 mb-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-contrast">
          <Icon name="shield" size={18} />
        </span>
        <div>
          <Typography variant="h2" className="text-base leading-tight">
            SENTINEL
          </Typography>
          <Typography variant="caption">Top Security Assets</Typography>
        </div>
      </div>

      <nav
        className="mt-6 flex-1 space-y-1 overflow-y-auto"
        aria-label="Dashboard sections"
      >
        {navItems.map((item) => {
          const isActive = item.id === activeNavId;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition duration-DEFAULT",
                isActive
                  ? "bg-primary text-primary-contrast shadow-sm"
                  : "text-text-secondary hover:bg-background hover:text-text",
              )}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1 border-t border-border pt-4">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-background hover:text-text"
        >
          <Icon name="settings" size={18} />
          Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-background hover:text-text"
        >
          <Icon name="logout" size={18} />
          Logout
        </Link>
      </div>
    </div>
  );
}
