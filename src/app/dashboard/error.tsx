"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary for every dashboard page. Without one, a render
 * error in a chart or card replaces the whole app with Next.js's default
 * screen; here the shell stays usable and the user can retry.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard render failed:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div
        className="w-full max-w-md rounded-md border border-border bg-surface p-6 text-center"
        role="alert"
      >
        <h1 className="m-0 text-base font-semibold text-text">This page could not be rendered</h1>
        <p className="mb-5 mt-2 text-sm text-text-secondary">
          The dashboard shell is unaffected. Retry, or reload if the problem persists.
          {error.digest ? ` Reference: ${error.digest}.` : ""}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-contrast transition duration-DEFAULT hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
