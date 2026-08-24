import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Generic surface container atom. Every dashboard panel (stat card,
 * traffic chart, package info, promo card, etc.) renders through this so
 * padding/radius/border/shadow never gets redefined per-panel.
 *
 * Ref-forwarding: some consumers (StatCard, KpiCard) attach an
 * IntersectionObserver via useScrollReveal for the entrance animation.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-surface shadow-sm",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
