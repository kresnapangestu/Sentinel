import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Base checkbox atom. Presentational only; label pairing happens in the
 * CheckboxField molecule.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-[18px] w-[18px] cursor-pointer rounded-sm accent-primary",
        className,
      )}
      {...rest}
    />
  ),
);

Checkbox.displayName = "Checkbox";
