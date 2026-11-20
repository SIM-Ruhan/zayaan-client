/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#14171f", cream: "#faf7f2", maroon: { DEFAULT: "#8b1e2d", dark: "#6d1622" }, gold: "#b8893b", navy: "#131a2a" },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], serif: ["Playfair Display", "Georgia", "serif"] },
    },
  },
  plugins: [],
};
