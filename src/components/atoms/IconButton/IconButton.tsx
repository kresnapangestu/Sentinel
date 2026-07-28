import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  "aria-label": string;
}

/**
 * Icon-only button atom. aria-label is required (not optional) so every
 * usage stays accessible by construction.
 */
export function IconButton({
  icon,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-sm border-none bg-transparent text-text-secondary transition duration-DEFAULT hover:bg-background hover:text-text",
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
