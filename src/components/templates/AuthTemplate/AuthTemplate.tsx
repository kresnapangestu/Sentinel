import { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

export interface AuthTemplateProps {
  marketingSlot: ReactNode;
  children: ReactNode;
}

/**
 * Page-level template: owns the split-screen layout and responsive
 * breakpoints only. Content is injected via slots so this template has
 * no knowledge of auth-specific logic.
 */
export function AuthTemplate({ marketingSlot, children }: AuthTemplateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="grid min-h-[680px] w-full max-w-[1200px] grid-cols-1 overflow-hidden rounded-lg bg-surface shadow-lg md:grid-cols-[40%_60%] lg:grid-cols-2">
        <div className="relative hidden min-h-full md:block">
          {marketingSlot}
        </div>

        <div className="relative flex flex-col p-5 lg:p-12">
          <div className="flex items-center justify-end gap-3">
            <ThemeToggle />
          </div>
          <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
