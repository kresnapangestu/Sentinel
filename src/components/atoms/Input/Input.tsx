import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

/**
 * Base input atom. Purely presentational and forwardRef-enabled so it can
 * be registered directly with React Hook Form.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-[52px] w-full rounded-md border bg-surface px-4 font-sans text-md text-text placeholder:text-text-secondary transition duration-DEFAULT",
          "hover:border-border-hover focus:outline-none focus:border-border-focus focus:shadow-focus",
          hasError
            ? "border-error focus:shadow-focus-error"
            : "border-border",
          className,
        )}
        aria-invalid={hasError || undefined}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
