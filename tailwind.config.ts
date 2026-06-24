import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-notion)", "Inter", "-apple-system", "system-ui", "'Segoe UI'", "Helvetica", "sans-serif"],
        display: ["var(--font-notion)", "Inter", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        /* Brand & Primary */
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          pressed: "rgb(var(--color-primary-pressed) / <alpha-value>)",
          deep: "rgb(var(--color-primary-deep) / <alpha-value>)",
        },
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",

        /* Brand Navy */
        "brand-navy": {
          DEFAULT: "rgb(var(--color-brand-navy) / <alpha-value>)",
          deep: "rgb(var(--color-brand-navy-deep) / <alpha-value>)",
          mid: "rgb(var(--color-brand-navy-mid) / <alpha-value>)",
        },

        /* Link */
        "link-blue": {
          DEFAULT: "rgb(var(--color-link-blue) / <alpha-value>)",
          pressed: "rgb(var(--color-link-blue-pressed) / <alpha-value>)",
        },

        /* Brand Accents */
        "brand-orange": {
          DEFAULT: "rgb(var(--color-brand-orange) / <alpha-value>)",
          deep: "rgb(var(--color-brand-orange-deep) / <alpha-value>)",
        },
        "brand-pink": {
          DEFAULT: "rgb(var(--color-brand-pink) / <alpha-value>)",
          deep: "rgb(var(--color-brand-pink-deep) / <alpha-value>)",
        },
        "brand-purple": {
          DEFAULT: "rgb(var(--color-brand-purple) / <alpha-value>)",
          300: "rgb(var(--color-brand-purple-300) / <alpha-value>)",
          800: "rgb(var(--color-brand-purple-800) / <alpha-value>)",
        },
        "brand-teal": "rgb(var(--color-brand-teal) / <alpha-value>)",
        "brand-green": "rgb(var(--color-brand-green) / <alpha-value>)",
        "brand-yellow": "rgb(var(--color-brand-yellow) / <alpha-value>)",
        "brand-brown": "rgb(var(--color-brand-brown) / <alpha-value>)",

        /* Card Tints */
        "tint-peach": "rgb(var(--color-card-tint-peach) / <alpha-value>)",
        "tint-rose": "rgb(var(--color-card-tint-rose) / <alpha-value>)",
        "tint-mint": "rgb(var(--color-card-tint-mint) / <alpha-value>)",
        "tint-lavender": "rgb(var(--color-card-tint-lavender) / <alpha-value>)",
        "tint-sky": "rgb(var(--color-card-tint-sky) / <alpha-value>)",
        "tint-yellow": "rgb(var(--color-card-tint-yellow) / <alpha-value>)",
        "tint-yellow-bold": "rgb(var(--color-card-tint-yellow-bold) / <alpha-value>)",
        "tint-cream": "rgb(var(--color-card-tint-cream) / <alpha-value>)",
        "tint-gray": "rgb(var(--color-card-tint-gray) / <alpha-value>)",

        /* Surfaces */
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          soft: "rgb(var(--color-surface-soft) / <alpha-value>)",
        },
        hairline: {
          DEFAULT: "rgb(var(--color-hairline) / <alpha-value>)",
          soft: "rgb(var(--color-hairline-soft) / <alpha-value>)",
          strong: "rgb(var(--color-hairline-strong) / <alpha-value>)",
        },

        /* Text */
        "ink-deep": "rgb(var(--color-ink-deep) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        charcoal: "rgb(var(--color-charcoal) / <alpha-value>)",
        slate: "rgb(var(--color-slate) / <alpha-value>)",
        steel: "rgb(var(--color-steel) / <alpha-value>)",
        stone: "rgb(var(--color-stone) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",

        /* Dark surfaces */
        "on-dark": {
          DEFAULT: "rgb(var(--color-on-dark) / <alpha-value>)",
          muted: "rgb(var(--color-on-dark-muted) / <alpha-value>)",
        },

        /* Semantic */
        success: "rgb(var(--color-semantic-success) / <alpha-value>)",
        warning: "rgb(var(--color-semantic-warning) / <alpha-value>)",
        error: "rgb(var(--color-semantic-error) / <alpha-value>)",
      },

      fontSize: {
        /* Notion typography scale */
        "hero-display": ["80px", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg": ["56px", { lineHeight: "1.10", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-1": ["48px", { lineHeight: "1.15", letterSpacing: "-0.005em", fontWeight: "600" }],
        "heading-2": ["36px", { lineHeight: "1.20", letterSpacing: "-0.005em", fontWeight: "600" }],
        "heading-3": ["28px", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-4": ["22px", { lineHeight: "1.30", fontWeight: "600" }],
        "heading-5": ["18px", { lineHeight: "1.40", fontWeight: "600" }],
        subtitle: ["18px", { lineHeight: "1.50", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.55", fontWeight: "400" }],
        "body-md-medium": ["16px", { lineHeight: "1.55", fontWeight: "500" }],
        "body-sm": ["14px", { lineHeight: "1.50", fontWeight: "400" }],
        "body-sm-medium": ["14px", { lineHeight: "1.50", fontWeight: "500" }],
        caption: ["13px", { lineHeight: "1.40", fontWeight: "400" }],
        "caption-bold": ["13px", { lineHeight: "1.40", fontWeight: "600" }],
        micro: ["12px", { lineHeight: "1.40", fontWeight: "500" }],
        "micro-uppercase": ["11px", { lineHeight: "1.40", letterSpacing: "0.1em", fontWeight: "600" }],
        "button-md": ["14px", { lineHeight: "1.30", fontWeight: "500" }],
      },

      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "20px",
        xxxl: "24px",
      },

      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        xxl: "32px",
        xxxl: "40px",
        "section-sm": "48px",
        section: "64px",
        "section-lg": "96px",
        hero: "120px",
      },

      maxWidth: {
        container: "1280px",
      },

      boxShadow: {
        "elevation-0": "none",
        "elevation-1": "rgba(15, 15, 15, 0.04) 0px 1px 2px 0px",
        "elevation-2": "rgba(15, 15, 15, 0.08) 0px 4px 12px 0px",
        "elevation-3": "rgba(15, 15, 15, 0.20) 0px 24px 48px -8px",
        "elevation-4": "rgba(15, 15, 15, 0.16) 0px 16px 48px -8px",
      },
    },
  },
  plugins: [],
};
export default config;
