import type { ReactNode } from "react";

// No extra global CSS import needed here -- variables.css + Tailwind
// directives are already imported once in the root layout.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
