"use client";

import { IconButton } from "@/components/atoms/IconButton";
import { Avatar } from "@/components/atoms/Avatar";
import { Typography } from "@/components/atoms/Typography";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { Icon } from "../Icon";
import type { CurrentUser } from "../../types";

export interface TopbarProps {
  user: CurrentUser;
  onToggleSidebar?: () => void;
  notificationCount?: number;
}

/** Sticky top bar: search, notifications, theme toggle, profile summary. */
export function Topbar({
  user,
  onToggleSidebar,
  notificationCount = 0,
}: TopbarProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-b border-border bg-surface px-4 py-3 md:px-6">
      <IconButton
        icon={<Icon name="menu" size={20} />}
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
        className="lg:hidden"
      />
      <ThemeToggle />

      <IconButton
        icon={
          <span className="relative inline-flex">
            <Icon name="bell" size={20} />
            {notificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                {notificationCount}
              </span>
            ) : null}
          </span>
        }
        aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ""}`}
      />

      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-background"
      >
        <Avatar alt={user.name} src={user.avatarUrl} size={36} />
        <span className="hidden text-left sm:block">
          <Typography
            variant="body"
            className="text-sm font-semibold leading-tight"
          >
            {user.name}
          </Typography>
          <Typography variant="caption" as="p" className="leading-tight">
            {user.email}
          </Typography>
        </span>
        <Icon
          name="chevronDown"
          size={16}
          className="hidden text-text-secondary sm:block"
        />
      </button>
    </div>
  );
}
