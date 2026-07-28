"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Label } from "@/components/atoms/Label";
import { Input } from "@/components/atoms/Input";
import { IconButton } from "@/components/atoms/IconButton";
import { Typography } from "@/components/atoms/Typography";
import { EyeIcon } from "./EyeIcon";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  id: string;
  errorMessage?: string;
}

/**
 * Password field molecule with a show/hide toggle. Visibility state is
 * local UI state only -- it has no bearing on form validity or values.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, id, errorMessage, ...rest }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const describedBy = errorMessage ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative flex items-center">
          <Input
            id={id}
            ref={ref}
            type={isVisible ? "text" : "password"}
            hasError={Boolean(errorMessage)}
            aria-describedby={describedBy}
            className="pr-12"
            {...rest}
          />
          <IconButton
            className="absolute right-2"
            icon={<EyeIcon isVisible={isVisible} />}
            aria-label={isVisible ? "Hide password" : "Show password"}
            onClick={() => setIsVisible((prev) => !prev)}
          />
        </div>
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

PasswordInput.displayName = "PasswordInput";
