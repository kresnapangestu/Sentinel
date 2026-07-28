import type { LoginCredentials, LoginResult } from "../types";

/**
 * Auth service abstraction. Every consumer depends on this interface, not
 * on the mocked implementation below -- swapping in a real API client
 * later only means changing loginRequest's internals.
 */
export interface AuthService {
  login(credentials: LoginCredentials): Promise<LoginResult>;
}

const MOCK_LATENCY_MS = 600;

async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  // TODO: replace with a real fetch/axios call to the auth API endpoint.
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  return {
    user: {
      id: "mock-user-id",
      email: credentials.email,
      name: credentials.email.split("@")[0],
    },
    token: "mock-jwt-token",
  };
}

export const authService: AuthService = {
  login: loginRequest,
};
