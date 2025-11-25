/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgDark: "#0d1117",
        bgCard: "rgba(255,255,255,0.06)",
        accent: "#6366f1",
        accent2: "#06b6d4",
        textLight: "#f8fafc",
        textMuted: "#94a3b8"
      },
    },

      backdropBlur: {
        xs: "2px",
    },
  },
  plugins: [],
};
