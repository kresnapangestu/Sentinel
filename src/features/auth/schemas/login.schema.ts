import { z } from "zod";
import {
  AUTH_VALIDATION_MESSAGES,
  PASSWORD_MIN_LENGTH,
} from "../constants/auth.constants";

/**
 * Single source of truth for login form validation. Consumed by
 * zodResolver() inside useLogin so RHF and Zod never fall out of sync.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGES.emailRequired)
    .email(AUTH_VALIDATION_MESSAGES.emailInvalid),
  password: z
    .string()
    .min(1, AUTH_VALIDATION_MESSAGES.passwordRequired)
    .min(PASSWORD_MIN_LENGTH, AUTH_VALIDATION_MESSAGES.passwordMinLength),
  rememberMe: z.boolean().default(false),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
