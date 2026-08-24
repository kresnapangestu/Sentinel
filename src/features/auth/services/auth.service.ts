import { apiGet, apiPost } from "@/lib/api-client";
import type { AuthenticatedUser, LoginCredentials, LoginResult } from "../types";

/**
 * Auth service abstraction. Every consumer depends on this interface, not
 * on the implementation below.
 *
 * The session itself is an HttpOnly cookie the gateway sets on the login
 * response -- this client never sees or stores a token. `credentials`
 * is destructured (not forwarded) because "remember me" has no backend
 * concept yet; keeping it out of the request body avoids implying a
 * feature that isn't there.
 */
export interface AuthService {
  login(credentials: LoginCredentials): Promise<LoginResult>;
  logout(): Promise<void>;
  /** Current session's user, or null if not authenticated. */
  me(): Promise<AuthenticatedUser | null>;
}

export const authService: AuthService = {
  async login({ email, password }: LoginCredentials): Promise<LoginResult> {
    return apiPost<LoginResult>("/auth/login", { email, password });
  },

  async logout(): Promise<void> {
    await apiPost<{ success: true }>("/auth/logout", {});
  },

  async me(): Promise<AuthenticatedUser | null> {
    try {
      return await apiGet<AuthenticatedUser>("/users/me");
    } catch {
      return null;
    }
  },
};
