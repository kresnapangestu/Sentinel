import { InputHTMLAttributes, forwardRef } from "react";
import { Label } from "@/components/atoms/Label";
import { Input } from "@/components/atoms/Input";
import { Typography } from "@/components/atoms/Typography";

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  errorMessage?: string;
}

/**
 * Composes Label + Input + error message into one labelled field.
 * Forwarded ref allows React Hook Form's register() to attach directly.
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, errorMessage, ...rest }, ref) => {
    const describedBy = errorMessage ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          ref={ref}
          hasError={Boolean(errorMessage)}
          aria-describedby={describedBy}
          {...rest}
        />
        {errorMessage ? (
          <Typography
            variant="caption"
            as="p"
            id={describedBy}
            className="mt-2 text-error"
          >
            {errorMessage}
          </Typography>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";
