import type {
  ChecklistSection,
  CurrentUser,
  HelpLink,
  NavItem,
  PricingOption,
  ProxyTab,
  SecurityInfo,
  StatCardData,
  TrafficPoint,
  TrafficRangeOption,
} from "../types";

export const CURRENT_USER: CurrentUser = {
  name: "development",
  email: "development@sentinel.com",
};

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: "overview", href: "/dashboard" },
  {
    id: "KPIMonitoring",
    label: "KPI Monitoring",
    icon: "kpiMonitoring",
    href: "/dashboard/kpi-monitoring",
  },
  {
    id: "methodComparison",
    label: "Method Comparison",
    icon: "methodComparison",
    href: "/dashboard/method-comparison",
  },
];

export const ACTIVE_NAV_ID = "overview";

export const PROXY_TABS: ProxyTab[] = [
  { id: "rotating", label: "Rotating" },
  { id: "static", label: "Static" },
  { id: "isp", label: "ISP Proxies" },
  { id: "mobile", label: "Mobile" },
];

export const ACTIVE_PROXY_TAB = "rotating";

export const STAT_CARDS: StatCardData[] = [
  {
    id: "totalKPI",
    icon: "home",
    title: "Total KPI",
    priceLabel: "Total",
    price: "10",
    unit: " KPI",
    trend: { value: "+2 KPI", direction: "down" },
    caption: "Total KPI Monitored",
    sparkline: [4, 6, 5, 8, 7, 10, 8, 12, 10, 14, 12, 16],
  },
  {
    id: "normal",
    icon: "infinity",
    title: "Normal KPI",
    priceLabel: "Total",
    price: "8",
    unit: " KPI",
    trend: { value: "80%", direction: "down" },
    caption: "KPI in normal condition",
    sparkline: [10, 8, 11, 7, 12, 9, 13, 10, 15, 11, 14, 12],
  },
  {
    id: "critical",
    icon: "grid",
    title: "Critical KPI",
    priceLabel: "Total",
    price: "2",
    unit: " KPI",
    trend: { value: "20%", direction: "down" },
    caption: "Detected by the system",
    sparkline: [6, 7, 6, 9, 8, 11, 9, 13, 11, 15, 13, 17],
  },
];

export const TRAFFIC_RANGE_OPTIONS: TrafficRangeOption[] = [
  { key: "24h", label: "24 Hours" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
];

export const DEFAULT_TRAFFIC_RANGE = "24h";
export const DEFAULT_KPI = "availability";

// One point every 1-2 hours across a 24h window, in MB. Shape
// approximates a typical proxy-traffic day: quiet overnight, rising
// through the day, peaking in the evening.
export const TRAFFIC_24H: TrafficPoint[] = [
  { time: "00:00", value: 0.32 },
  { time: "02:00", value: 0.22 },
  { time: "04:00", value: 0.18 },
  { time: "06:00", value: 0.28 },
  { time: "08:00", value: 0.42 },
  { time: "10:00", value: 0.58 },
  { time: "12:00", value: 0.5 },
  { time: "14:00", value: 0.62 },
  { time: "15:00", value: 0.7 },
  { time: "16:00", value: 0.78 },
  { time: "17:00", value: 0.7 },
  { time: "18:00", value: 0.92 },
  { time: "19:00", value: 1.2 },
  { time: "20:00", value: 1.0 },
  { time: "21:00", value: 0.86 },
  { time: "22:00", value: 0.68 },
  { time: "23:00", value: 0.5 },
  { time: "24:00", value: 0.4 },
];

export const TRAFFIC_7D: TrafficPoint[] = [
  { time: "Mon", value: 0.6 },
  { time: "Tue", value: 0.82 },
  { time: "Wed", value: 0.74 },
  { time: "Thu", value: 0.95 },
  { time: "Fri", value: 1.2 },
  { time: "Sat", value: 0.68 },
  { time: "Sun", value: 0.5 },
];

export const TRAFFIC_30D: TrafficPoint[] = Array.from(
  { length: 30 },
  (_, index) => ({
    time: `${index + 1}`,
    value: Number(
      (0.4 + Math.sin(index / 3) * 0.3 + (index / 30) * 0.5).toFixed(2),
    ),
  }),
);

export const TRAFFIC_HIGHLIGHT_LABEL = "May 20, 17:00";
export const TRAFFIC_PEAK_LABEL = "1.2 MB";
export const TRAFFIC_AVERAGE_LABEL = "345 KB";

export const PACKAGE_INFO: ChecklistSection = {
  title: "Package Information",
  icon: "package",
  ctaLabel: "View Plans",
  items: [
    [
      "Optimal performance & ultra-low latency",
      "Suitable for various web scraping needs",
      "Diverse proxy types",
    ],
    ["Global coverage", "99.9% uptime", "AI Model training"],
  ],
};

export const SECURITY_INFO: SecurityInfo = {
  title: "2-Factor Authentication",
  icon: "shield",
  description:
    "Please turn on 2-factor authentication to ensure your account security.",
  items: [
    "Email code and Google Authenticator",
    "Increased account security",
    "Protection against password theft",
  ],
  ctaLabel: "Enable 2FA",
};

export const HELP_LINKS: HelpLink[] = [
  {
    id: "faq",
    icon: "faq",
    title: "FAQ",
    description: "Find answers to frequent asked ques.",
  },
  {
    id: "blog",
    icon: "blog",
    title: "Blog",
    description: "Get help on how to our proxies",
  },
  {
    id: "notice",
    icon: "notice",
    title: "Notice Board",
    description: "Check latest updates on SENTINEL",
  },
];

export const PRICING_OPTIONS: PricingOption[] = [
  {
    id: "payg",
    label: "Pay as you go",
    price: "$3.6",
    unit: "/GB",
    period: "30 Day",
  },
  {
    id: "subscription",
    label: "Subscription",
    price: "$0.6",
    unit: "/GB",
    period: "30 Day",
  },
];

export const NOTIFICATION_COUNT = 8;
