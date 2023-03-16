/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark"],
    defaultTheme: "light",
  },
  plugins: [
    require("tailwindcss-radix"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
};
