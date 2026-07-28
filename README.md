# Sentinel — Login + Dashboard

A Next.js (App Router) + TypeScript app: a Sentinel-branded login page and
a SENTINEL-style analytics dashboard, sharing one feature-based + atomic
design system, Tailwind CSS, dark mode, and Apache ECharts.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` (redirects to `/login`). Any email + an
8+ character password passes validation and navigates to `/dashboard`
(no backend yet — see Authentication below).

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # ThemeProvider + no-flash script + global CSS
│   ├── page.tsx             # redirects to /login
│   ├── login/               # login route
│   └── dashboard/           # dashboard route
├── features/
│   ├── auth/                 # login-specific components/hooks/schema/service
│   └── dashboard/             # dashboard-specific components/hooks/services/constants
├── components/
│   ├── atoms/                # Button, Input, Checkbox, Label, Typography,
│   │                          IconButton, Card, Badge, Avatar
│   ├── molecules/             # FormField, PasswordInput, CheckboxField,
│   │                          ThemeToggle, EChart
│   └── templates/             # AuthTemplate, DashboardTemplate
├── lib/                       # ThemeProvider, theme.ts (cross-cutting infra)
├── hooks/                     # useTheme (cross-feature hook)
├── utils/                     # cn() classname combiner
└── styles/variables.css       # every design token, light + dark
```

Feature-based + Atomic Design, unchanged from the original login page:
generic/reusable UI lives in `components/`, anything feature-specific
lives inside that feature's own folder, and nothing in `components/`
knows about auth or dashboard domain logic.

## Styling

Tailwind CSS utility classes only — no CSS Modules, no UI library.
Every Tailwind color/radius/shadow/font-size resolves to a CSS variable
in `src/styles/variables.css` (see `tailwind.config.ts`), so light/dark
theming and the maroon rebrand both happen in one file.

## Theme (dark mode)

Unchanged from the earlier dark-mode pass: `ThemeProvider` + `useTheme`

- `ThemeToggle`, `data-theme="light|dark"` on `<html>`, persisted to
  `localStorage`, defaults to system preference, and a blocking inline
  script in the root layout prevents a flash of the wrong theme.

## Authentication (mocked)

`features/auth/services/auth.service.ts` exposes a `login()` that
returns a mocked Promise. `useLogin` wires React Hook Form + Zod
(`loginSchema`) to it: once validation passes, `authService.login()`
resolves (no server exists to reject it) and `useLogin` calls
`router.push("/dashboard")`. Swapping in a real API is a one-file change
to `auth.service.ts` — nothing above that layer needs to change.

## Dashboard

`features/dashboard` mirrors the same pattern:

- **`services/dashboard.service.ts`** — the only place mock data is
  wrapped in Promises; every fetcher is a seam for a future API.
- **`constants/dashboard.constants.ts`** — every hardcoded value (nav
  items, stat card numbers, traffic series, help links, pricing) lives
  here, not inside components.
- **`services/chart-options.service.ts`** — pure ECharts `EChartsOption`
  builders, isolated from React entirely. Components never construct
  chart config inline.
- **`components/`** — `Sidebar`, `Topbar`, `ProxyTabs`, `StatCard`,
  `TrafficChart`, `PackageInfoCard`, `SecurityCard`, `PromoCard`,
  `CdkRedeemCard`, `HelpCenterCard`, `PricingCard`, and `DashboardView`
  (the page-level composition, including the mobile sidebar drawer).
- **`components/Icon`** — a single SVG icon registry keyed by `IconKey`,
  so every icon in the sidebar/topbar/cards stays visually consistent.

Charts render through `components/molecules/EChart`, a thin wrapper that
is the _only_ place the `echarts` package is imported — chart
configuration (colors, series, tooltips) stays entirely in
`chart-options.service.ts`.

## Key decisions

- **Button's `size`/`fullWidth`/`variant` props**, not className
  overrides, control layout and color. Tailwind utility classes of the
  same CSS property don't reliably cascade based on `className` string
  order (source order is determined by Tailwind's build, not usage
  order), so anywhere two conflicting utilities might apply, the
  component exposes a real prop instead.
- **`inverted` Button variant** exists specifically for buttons placed on
  colored/gradient surfaces (e.g. `PromoCard`'s "Try It Free"), for the
  same reason.
- **ECharts colors are resolved hex/rgba, not CSS `var()`.** ECharts
  renders to canvas, so `chart-options.service.ts` mirrors
  `variables.css`'s light/dark values directly; components re-run the
  builder when `theme` changes via `useTheme`.
- **`DashboardTemplate`** only owns the sidebar/topbar/content shell —
  no proxy or auth-specific knowledge — so it's reusable for any future
  authenticated page. The mobile nav drawer lives in `DashboardView`
  instead, since it needs page-level open/close state.
