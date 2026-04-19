import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: "#faf9f7",
          100: "#f5f3f0",
          200: "#ebe8e4",
          300: "#ccc7c0",
          400: "#a89f97",
          600: "#6b6560",
          800: "#2e2926",
          950: "#1a1714",
        },
        saffron: {
          50: "#fef9f1",
          100: "#fdf3e3",
          200: "#fae7c8",
          500: "#d98e2a",
          600: "#c47a1e",
          700: "#a36318",
        },
        success: "#2d6a4f",
        "success-light": "#d1fae5",
        error: "#9b2335",
        "error-light": "#fee2e2",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      ringColor: {
        DEFAULT: "#c47a1e",
        saffron: "#c47a1e",
      },
      ringOffsetColor: {
        DEFAULT: "#faf9f7",
      },
      transitionProperty: {
        height: "height, max-height",
      },
    },
  },
  plugins: [],
};
export default config;
