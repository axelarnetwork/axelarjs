/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-radix"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      { light: require("./themes/light.cjs") },
      { dark: require("./themes/dark.cjs") },
    ],
  },
  darkMode: ["class", '[data-theme="dark"]'],
};
