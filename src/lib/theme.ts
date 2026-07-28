export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "sentinel-theme";
export const THEME_ATTRIBUTE = "data-theme";
export const DEFAULT_THEME: Theme = "light";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

/** Reads the explicit user preference, if one was ever saved. */
export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : null;
}

/** Falls back to the OS/browser color-scheme preference. */
export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Stored preference wins; otherwise defers to the system preference. */
export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}
