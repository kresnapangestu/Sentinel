import { NextRequest, NextResponse } from "next/server";

/** Mirrors nest-gateway/src/shared/auth/token.service.ts's SESSION_COOKIE_NAME. */
const SESSION_COOKIE_NAME = "sentinel_session";

/**
 * First line of defense for protected routes: redirects to /login when the
 * session cookie is simply absent. This only checks presence, not validity
 * -- the gateway is the source of truth and rejects a forged/expired token
 * with 401 on the first API call, which api-client.ts also redirects to
 * /login (see unwrap()). Cheap here, authoritative there.
 */
export function middleware(request: NextRequest): NextResponse {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
