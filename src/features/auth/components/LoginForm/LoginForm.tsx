"use client";

import Link from "next/link";
import { FormField } from "@/components/molecules/FormField";
import { CheckboxField } from "@/components/molecules/CheckboxField";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { useLogin } from "../../hooks/useLogin";
import { PasswordField } from "../PasswordField";
import { AUTH_FIELD_IDS } from "../../constants/auth.constants";

/**
 * Orchestrates the login form: delegates all state/logic to useLogin and
 * composes molecules/atoms for the actual markup. No validation or
 * submission logic lives in this component itself.
 */
export function LoginForm() {
  const { register, errors, isSubmitting, submitError, handleSubmit } =
    useLogin();

  return (
    <form
      className="flex w-full flex-col gap-5"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <FormField
        id={AUTH_FIELD_IDS.email}
        label="Your Email"
        type="email"
        placeholder="youremail@gmail.com"
        autoComplete="email"
        errorMessage={errors.email?.message}
        {...register("email")}
      />

      <PasswordField register={register} error={errors.password} />

      {submitError ? (
        <Typography
          variant="caption"
          as="p"
          role="alert"
          className="-mt-3 text-error"
        >
          {submitError}
        </Typography>
      ) : null}

      <Button type="submit" isLoading={isSubmitting}>
        Login
      </Button>
    </form>
  );
}
