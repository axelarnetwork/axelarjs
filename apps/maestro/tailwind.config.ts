import { fontFamily } from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

module.exports = {
  presets: [require("@axelarjs/ui/preset")],
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/ui/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
} satisfies Config;
