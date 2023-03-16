/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require("tailwindcss-radix"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: ["class", '[data-theme="dark"]'],
};
