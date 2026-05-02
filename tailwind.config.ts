import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0d",
        bg2: "#111111",
        bg3: "#141310",
        bg4: "#1a1916",
        or: "#eb5939",
        or2: "#f06f52",
        or3: "#d94c2f",
        fg: "#b7ab98",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-syne-mono)", "monospace"],
      },
      letterSpacing: {
        wider2: "0.38em",
        widest2: "0.28em",
      },
    },
  },
  plugins: [],
};
export default config;
