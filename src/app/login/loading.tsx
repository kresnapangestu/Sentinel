/** Route-level loading skeleton shown while the login route streams in. */
export default function LoginLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
    </div>
  );
}
