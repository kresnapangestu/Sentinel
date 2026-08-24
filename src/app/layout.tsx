import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@/styles/variables.css";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from "@/lib/theme";

export const metadata: Metadata = {
  title: "SENTINEL",
  description:
    "Anomaly detection for telecommunication network KPIs, using Z-Score (univariate) and Isolation Forest (multivariate).",
};

// Runs synchronously before first paint, so the correct theme is on the
// page before React hydrates -- this is what prevents the light/dark flash.
const noFlashScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("${THEME_ATTRIBUTE}", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
