import { fontFamily } from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

const config: Config = {
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
};

export default config;
