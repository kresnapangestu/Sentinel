/** Domain types for the dashboard feature. */

import { AutocompleteOption } from "@/components/atoms/Autocomplete";

export type IconKey =
  | "overview"
  | "proxies"
  | "scraping"
  | "wallet"
  | "invoice"
  | "help"
  | "cdk"
  | "referral"
  | "reseller"
  | "settings"
  | "logout"
  | "menu"
  | "search"
  | "bell"
  | "chevronDown"
  | "home"
  | "infinity"
  | "grid"
  | "traffic"
  | "package"
  | "shield"
  | "gift"
  | "code"
  | "faq"
  | "blog"
  | "notice"
  | "cart"
  | "arrowRight"
  | "check"
  | "kpiMonitoring"
  | "methodComparison";

export interface NavItem {
  id: string;
  label: string;
  icon: IconKey;
  href: string;
}

export interface CurrentUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

export type TrendDirection = "up" | "down";

export interface StatCardData {
  id: string;
  icon: IconKey;
  title: string;
  priceLabel: string;
  price: string;
  unit: string;
  trend: {
    value: string;
    direction: TrendDirection;
  };
  caption: string;
  sparkline: number[];
}

export type TrafficRangeKey = "24h" | "7d" | "30d";

export interface TrafficRangeOption {
  key: TrafficRangeKey;
  label: string;
}

export const KPI_OPTIONS = [
  {
    label: "Throughput",
    value: "throughput",
  },
  {
    label: "Latency",
    value: "latency",
  },
  {
    label: "Packet Loss",
    value: "packet-loss",
  },
  {
    label: "Availability",
    value: "availability",
  },
] satisfies readonly AutocompleteOption[];

export type KPIKey = (typeof KPI_OPTIONS)[number]["value"];

export interface KPIOption {
  label: string;

  value: KPIKey;
}

export interface TrafficPoint {
  time: string;
  value: number;
}

export interface TrafficSummary {
  peakLabel: string;
  averageLabel: string;
  points: TrafficPoint[];
  highlight: {
    time: string;
    valueLabel: string;
    index: number;
  };
}

export interface ChecklistSection {
  title: string;
  icon: IconKey;
  items: string[][];
  ctaLabel: string;
}

export interface SecurityInfo {
  title: string;
  icon: IconKey;
  description: string;
  items: string[];
  ctaLabel: string;
}

export interface HelpLink {
  id: string;
  icon: IconKey;
  title: string;
  description: string;
}

export interface PricingOption {
  id: string;
  label: string;
  price: string;
  unit: string;
  period: string;
}

export interface ProxyTab {
  id: string;
  label: string;
}
