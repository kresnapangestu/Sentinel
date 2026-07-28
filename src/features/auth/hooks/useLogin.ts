"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginSchemaType } from "../schemas/login.schema";
import { authService } from "../services/auth.service";
import { DASHBOARD_ROUTE } from "../constants/auth.constants";

export interface UseLoginResult {
  register: ReturnType<typeof useForm<LoginSchemaType>>["register"];
  control: ReturnType<typeof useForm<LoginSchemaType>>["control"];
  errors: ReturnType<typeof useForm<LoginSchemaType>>["formState"]["errors"];
  isSubmitting: boolean;
  submitError: string | null;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

/**
 * Encapsulates all login form orchestration: RHF wiring, Zod validation,
 * and the auth service call. Components stay presentational and simply
 * consume what this hook exposes.
 */
export function useLogin(): UseLoginResult {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onBlur",
  });

  const onValid = useCallback(
    async (values: LoginSchemaType) => {
      setSubmitError(null);
      try {
        // No backend yet: authService is still called so swapping in a
        // real API later is a one-file change, but with no server to
        // reject valid credentials, a Zod-valid submission always
        // proceeds straight to the dashboard.
        await authService.login(values);
        router.push(DASHBOARD_ROUTE);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong.";
        setSubmitError(message);
      }
    },
    [router],
  );

  const handleSubmit = useCallback(
    (e?: React.BaseSyntheticEvent) => rhfHandleSubmit(onValid)(e),
    [rhfHandleSubmit, onValid],
  );

  return { register, control, errors, isSubmitting, submitError, handleSubmit };
}
