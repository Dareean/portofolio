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
        "void-black": "#F5F5F5",
        "off-white": "#1A1A1A",
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
