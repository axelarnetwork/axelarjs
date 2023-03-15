/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./tailwind.config.preset.cjs")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
};
