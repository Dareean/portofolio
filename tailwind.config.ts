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
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      colors: {
        "void-black": "rgb(var(--background-rgb) / <alpha-value>)",
        "off-white": "rgb(var(--foreground-rgb) / <alpha-value>)",
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      height: {
        "128": "32rem",
        "144": "36rem",
      },
    },
  },
  plugins: [],
};
export default config;
