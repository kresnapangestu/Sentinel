import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-dark-from": "var(--surface-dark-from)",
        "surface-dark-to": "var(--surface-dark-to)",
        "surface-hover": "var(--surface-hover)",
        text: {
          DEFAULT: "var(--text)",
          secondary: "var(--text-secondary)",
          inverse: "var(--text-inverse)",
          "inverse-secondary": "var(--text-inverse-secondary)",
          "inverse-tetriary": "var(--text-inverse-tetriary)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          contrast: "var(--primary-contrast)",
          soft: "var(--primary-soft)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
          focus: "var(--border-focus)",
        },
        error: "var(--error)",
        success: "var(--success)",
        "success-soft": "var(--success-soft)",
        "error-soft": "var(--error-soft)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        focus: "var(--shadow-focus)",
        "focus-error": "var(--shadow-focus-error)",
      },
      transitionDuration: {
        DEFAULT: "160ms",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        xs: "var(--fs-xs)",
        sm: "var(--fs-sm)",
        md: "var(--fs-md)",
        lg: "var(--fs-lg)",
        xl: "var(--fs-xl)",
        "2xl": "var(--fs-2xl)",
        "3xl": "var(--fs-3xl)",
      },
    },
  },
  plugins: [],
};

export default config;
