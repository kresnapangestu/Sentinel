import { SVGAttributes } from "react";
import type { IconKey } from "../../types";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconKey;
  size?: number;
}

const paths: Record<IconKey, JSX.Element> = {
  overview: (
    <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" />
  ),
  proxies: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  scraping: <path d="M4 6h16M4 6l2 14h12l2-14M9 10v6M15 10v6" />,
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M15 14h3" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1.4.9-1.4 1.9v.3" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  cdk: <path d="M8 9 4 12l4 3M16 9l4 3-4 3M13 6l-2 12" />,
  referral: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M10 10 6 18M14 14l4-8" />
    </>
  ),
  reseller: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6M12 9v6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  logout: <path d="M9 5H5v14h4M15 12H3m0 0 4-4m-4 4 4 4M15 5h4v14h-4" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </>
  ),
  bell: (
    <path d="M6 9a6 6 0 1 1 12 0v5l1.5 3h-15L6 14V9ZM10 20a2 2 0 0 0 4 0" />
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  home: (
    <path d="m4 11 8-7 8 7v8a2 2 0 0 1-2 2h-3v-6H9v6H6a2 2 0 0 1-2-2v-8Z" />
  ),
  infinity: (
    <path d="M8.5 15.5a3.5 3.5 0 1 1 0-7c2.5 0 3.5 3.5 3.5 3.5s1-3.5 3.5-3.5a3.5 3.5 0 1 1 0 7c-2.5 0-3.5-3.5-3.5-3.5s-1 3.5-3.5 3.5Z" />
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  traffic: <path d="m3 16 4-5 4 3 4-7 6 9M3 20h18" />,
  package: (
    <>
      <path d="m3 8 9-5 9 5-9 5-9-5Z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />,
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M2 9h20v3H2zM12 9v11M12 9C10 4 4 5 6 8s5 1 6 1c1 0-1-4-2-1s2 4 6 1c2-3-4-4-6 0" />
    </>
  ),
  code: <path d="m9 8-5 4 5 4M15 8l5 4-5 4" />,
  faq: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1.4.9-1.4 1.9v.3" />
    </>
  ),
  blog: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h4" />
    </>
  ),
  notice: (
    <>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
      <path d="M3 4h2l2.5 11h10L19 8H6" />
    </>
  ),
  kpiMonitoring: (
    <>
      <path d="M4 20h16" />
      <path d="M7 16v-3" />
      <path d="M12 16V8" />
      <path d="M17 16v-6" />
      <path d="M6 10l4-3 3 2 5-4" />
    </>
  ),
  methodComparison: (
    <>
      <path d="M8 7v10" />
      <path d="M16 7v10" />
      <path d="M8 12h8" />
      <circle cx="8" cy="7" r="2" />
      <circle cx="16" cy="17" r="2" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 13 4 4L19 7" />,
};

/** Renders one dashboard icon by key -- the only place SVG markup lives. */
export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
