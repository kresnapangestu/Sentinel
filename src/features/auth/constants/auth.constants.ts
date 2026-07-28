/** Centralized copy/config so validation messages never drift across files. */
export const AUTH_VALIDATION_MESSAGES = {
  emailRequired: "Email is required.",
  emailInvalid: "Enter a valid email address.",
  passwordRequired: "Password is required.",
  passwordMinLength: "Password must be at least 8 characters.",
} as const;

export const AUTH_FIELD_IDS = {
  email: "login-email",
  password: "login-password",
  rememberMe: "login-remember-me",
} as const;

export const PASSWORD_MIN_LENGTH = 8;

/** Where useLogin navigates on success. No backend yet, so this is the
 *  single place that decides the post-login destination. */
export const DASHBOARD_ROUTE = "/dashboard";
