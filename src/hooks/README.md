Hooks reused across multiple features.

- `useTheme.ts` — reads/toggles the current theme via ThemeContext. Used
  by `ThemeToggle`, the dashboard `Topbar`, `StatCard`, and `TrafficChart`.

Feature-specific hooks (`useLogin`, `useDashboardData`, `useTrafficRange`)
stay inside their own feature's `hooks/` folder.
