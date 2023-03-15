/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-radix"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
};
