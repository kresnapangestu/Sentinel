"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/utils/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Rendered on the title row, right of the heading (badges, counts, filters). */
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Generic dialog molecule: portal + backdrop, Escape to close, background
 * scroll lock, and focus moved into the panel on open. Every modal in the app
 * renders through this so overlay behaviour never gets re-implemented.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  headerSlot,
  footerSlot,
  children,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] motion-safe:animate-[fadeIn_140ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-lg border border-border bg-surface shadow-lg outline-none",
          "sm:max-h-[85vh] sm:max-w-3xl sm:rounded-lg",
          "motion-safe:animate-[modalIn_160ms_cubic-bezier(0.4,0,0.2,1)]",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <Typography variant="h2" className="truncate text-lg">
              {title}
            </Typography>
            {description ? (
              <Typography variant="bodySmall" as="p" className="mt-0.5">
                {description}
              </Typography>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {headerSlot}
            <IconButton aria-label="Close" onClick={onClose} icon={<X size={18} />} />
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footerSlot ? (
          <footer className="border-t border-border px-5 py-3">{footerSlot}</footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
