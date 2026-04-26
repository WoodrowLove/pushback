/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Gentle palette: trustworthy, not corporate-cold
        ink: "#0f1922",
        paper: "#fbfbfa",
        accent: "#d65a31", // warm orange — pushes back, doesn't shout
        muted: "#5a6577",
        good: "#2d7d46",
        warn: "#b88200",
        bad: "#a93838",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        serif: ['"Source Serif Pro"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
