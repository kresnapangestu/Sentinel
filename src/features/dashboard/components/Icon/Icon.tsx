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
  logout: <path d="M9 5H5v14h4M15 12H3m0 0 4-4m-4 4 4 4M15 5h4v14h-4" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
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
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />,
  kpiMonitoring: (
    <>
      <path d="M4 20h16" />
      <path d="M7 16v-3" />
      <path d="M12 16V8" />
      <path d="M17 16v-6" />
      <path d="M6 10l4-3 3 2 5-4" />
    </>
  ),
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
