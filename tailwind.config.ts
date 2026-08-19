import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf4",
          100: "#d7f8e5",
          200: "#b3efce",
          300: "#7fe0ae",
          400: "#45ca89",
          500: "#22ad6b",
          600: "#168b55",
          700: "#146f47",
          800: "#14593b",
          900: "#124a33"
        }
      },
      boxShadow: {
        soft: "0 20px 60px rgba(18, 74, 51, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
