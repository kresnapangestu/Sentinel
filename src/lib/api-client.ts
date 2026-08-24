/** Shared fetch wrapper for the NestJS gateway -- the "API client instance,
 * env config" src/lib/README.md reserves this folder for, now that auth,
 * dashboard, and kpi-monitoring all need one.
 */

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
}

function baseUrl(): string {
  // The gateway runs on :3001 -- :3000 is this Next.js app itself.
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
}

async function unwrap<T>(response: Response): Promise<T> {
  // A missing/expired session cookie: bounce to /login rather than let every
  // caller special-case 401. The login/logout/me calls that legitimately
  // expect a 401 (e.g. checking whether a session exists) catch it before it
  // reaches here -- see authService.me().
  if (response.status === 401 && typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }

  const body = (await response.json()) as Envelope<T>;

  if (!body.success || body.data === undefined) {
    throw new ApiError(
      body.error?.code ?? "unknown_error",
      body.error?.message ?? `Request failed with status ${response.status}`,
      body.error?.details,
    );
  }

  return body.data;
}

export type QueryParams = Record<string, string | number | string[] | undefined>;

export async function apiGet<T>(
  path: string,
  params?: QueryParams,
  /** Lets pollers cancel an in-flight request instead of racing it. */
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(path, baseUrl());

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }
  }

  // "include": the gateway's session cookie is HttpOnly and cross-origin
  // (:3000 -> :3001 in development), so it is sent only if every request
  // opts in -- the browser default is to omit it.
  const response = await fetch(url.toString(), { signal, credentials: "include" });
  return unwrap<T>(response);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(new URL(path, baseUrl()).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return unwrap<T>(response);
}
