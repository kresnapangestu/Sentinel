"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_THEME,
  getStoredTheme,
  resolveInitialTheme,
  Theme,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from "./theme";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Single source of truth for theme state. The blocking inline script in
 * the root layout already paints the correct `data-theme` before
 * hydration (no FOUC); this provider re-reads that same resolution logic
 * on mount so React state matches the DOM, then takes over for every
 * subsequent change (manual toggle, or a live system-preference change
 * while no explicit choice has been saved).
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setThemeState(resolveInitialTheme());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme()) return;
      setThemeState(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
