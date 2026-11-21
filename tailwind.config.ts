import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f5",
          100: "#d5ebe6",
          200: "#add7cd",
          300: "#7cbbb0",
          400: "#4b9b8e",
          500: "#2f7f74",
          600: "#24665f",
          700: "#1f524e",
          800: "#1b423f",
          900: "#183835",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 4px 16px rgba(16,24,40,.06)",
      },
    },
  },
  plugins: [],
};

export default config;
