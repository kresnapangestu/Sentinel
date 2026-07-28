"use client";

import { useContext } from "react";
import { ThemeContext, ThemeContextValue } from "@/lib/ThemeProvider";

/**
 * Reads/sets the current theme. Must be used within <ThemeProvider>,
 * which wraps the whole app in the root layout.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
