import { UseFormRegister, FieldError } from "react-hook-form";
import { PasswordInput } from "@/components/molecules/PasswordInput";
import { LoginSchemaType } from "../../schemas/login.schema";
import { AUTH_FIELD_IDS } from "../../constants/auth.constants";

export interface PasswordFieldProps {
  register: UseFormRegister<LoginSchemaType>;
  error?: FieldError;
}

/**
 * Feature-level connector: wires the generic PasswordInput molecule to
 * the login form's RHF register() call, keeping field ids/names in one
 * place instead of scattered across the form.
 */
export function PasswordField({ register, error }: PasswordFieldProps) {
  return (
    <PasswordInput
      id={AUTH_FIELD_IDS.password}
      label="Password"
      placeholder="Enter your password"
      autoComplete="current-password"
      errorMessage={error?.message}
      {...register("password")}
    />
  );
}
