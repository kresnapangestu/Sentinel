import { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

/** Base label atom, always paired with a form control via htmlFor. */
export function Label({ className, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn("mb-2 inline-block text-sm font-semibold text-text", className)}
      {...rest}
    >
      {children}
    </label>
  );
}
