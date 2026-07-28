import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Label } from "@/components/atoms/Label";
import { cn } from "@/utils/cn";

export interface CheckboxFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  children: ReactNode;
}

/** Pairs a Checkbox atom with an inline Label sharing the same id. */
export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ id, children, className, ...rest }, ref) => (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Checkbox id={id} ref={ref} {...rest} />
      <Label htmlFor={id} className="mb-0 cursor-pointer font-medium">
        {children}
      </Label>
    </div>
  ),
);

CheckboxField.displayName = "CheckboxField";
