import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type BadgeTone = "success" | "error" | "primary" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const toneStyles: Record<BadgeTone, string> = {
  success: "bg-success-soft text-success",
  error: "bg-error-soft text-error",
  primary: "bg-primary-soft text-primary",
  neutral: "bg-background text-text-secondary",
};

/** Small pill badge atom used for trend indicators and status labels. */
export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
