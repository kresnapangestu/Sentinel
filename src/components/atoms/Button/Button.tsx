import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverted";
export type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-text text-text-inverse-tetriary shadow-sm hover:bg-surface-hover",
  secondary: "bg-surface text-text border border-border hover:border-primary",
  ghost: "bg-transparent text-primary shadow-none",
  // For buttons placed on a colored/gradient surface (e.g. PromoCard) --
  // a dedicated variant instead of overriding primary's colors via
  // className, since same-property Tailwind utilities don't reliably
  // cascade in className string order.
  inverted: "bg-white text-primary shadow-sm hover:bg-white/90",
};

// Each size is a complete, self-contained set (height/padding/radius/width)
// so a consumer never needs to override sizing via className -- that would
// mean two conflicting Tailwind utilities competing on class order, which
// Tailwind doesn't reliably resolve.
const sizeStyles: Record<ButtonSize, string> = {
  md: "h-[52px] w-full px-5 rounded-md",
  sm: "h-10 w-auto px-4 rounded-pill text-sm",
};

/**
 * Base button atom. Single responsibility: render a styled, accessible
 * button with an optional loading state. No business logic lives here.
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-semibold transition duration-DEFAULT active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        sizeStyles[size],
        fullWidth && size === "sm" ? "w-full" : null,
        variantStyles[variant],
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <span
          className="absolute h-[18px] w-[18px] animate-spin rounded-full border-2 border-[var(--spinner-track)] border-t-text-inverse"
          aria-hidden="true"
        />
      ) : null}
      <span className={isLoading ? "opacity-0" : undefined}>{children}</span>
    </button>
  );
}
