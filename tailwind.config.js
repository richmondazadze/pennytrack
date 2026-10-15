/** @type {import('tailwindcss').Config} */
const tokens = require("./lib/design/tokens.json");

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: tokens.colors.forest, 600: tokens.colors.forest2 },
        lime: { DEFAULT: tokens.colors.lime, 600: tokens.colors.lime2 },
        income: tokens.colors.income,
        expense: tokens.colors.expense,
        warn: tokens.colors.warn,
        info: tokens.colors.info,
        n: {
          0: tokens.colors.n0,
          25: tokens.colors.n25,
          50: tokens.colors.n50,
          100: tokens.colors.n100,
          200: tokens.colors.n200,
          300: tokens.colors.n300,
          400: tokens.colors.n400,
          500: tokens.colors.n500,
          600: tokens.colors.n600,
          700: tokens.colors.n700,
          800: tokens.colors.n800,
          900: tokens.colors.n900,
          950: tokens.colors.n950,
        },
        // Semantic colours flip between the light and dark themes (see globals.css).
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        sunken: "rgb(var(--sunken) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        action: "rgb(var(--action) / <alpha-value>)",
        "on-action": "rgb(var(--on-action) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["3rem", { lineHeight: "3.5rem", fontWeight: "700", letterSpacing: "-0.02em" }],
        h1: ["2rem", { lineHeight: "2.5rem", fontWeight: "700", letterSpacing: "-0.015em" }],
        h2: ["1.5rem", { lineHeight: "2rem", fontWeight: "700", letterSpacing: "-0.01em" }],
        h3: ["1.125rem", { lineHeight: "1.625rem", fontWeight: "600" }],
      },
      borderRadius: {
        xs: "6px",
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        raised: "0 1px 2px rgba(18,25,22,.04), 0 2px 8px rgba(18,25,22,.05)",
        overlay: "0 8px 24px rgba(18,25,22,.10), 0 2px 6px rgba(18,25,22,.06)",
        modal: "0 24px 64px rgba(18,25,22,.22)",
        fab: "0 8px 20px rgba(168,214,44,.45)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.22,1,.36,1)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
