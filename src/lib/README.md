Cross-cutting infrastructure shared across features.

- `theme.ts` — theme type, storage key, and pure helpers for resolving the
  initial light/dark preference (localStorage, then system).
- `ThemeProvider.tsx` — the app-wide theme context/provider. Wraps
  `children` once in the root layout.

Add further infrastructure (API client instance, env config, third-party
SDK setup) here only when a second feature needs to share it.
