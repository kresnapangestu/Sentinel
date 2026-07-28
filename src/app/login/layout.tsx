import type { ReactNode } from "react";

// Global tokens/Tailwind directives are imported once in the root layout
// (src/app/layout.tsx), which also owns the <html data-theme> attribute.
export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
