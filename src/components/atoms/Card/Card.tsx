import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Generic surface container atom. Every dashboard panel (stat card,
 * traffic chart, package info, promo card, etc.) renders through this so
 * padding/radius/border/shadow never gets redefined per-panel.
 */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-sm",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
