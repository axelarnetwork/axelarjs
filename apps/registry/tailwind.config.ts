import { fontFamily } from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@axelarjs/ui/preset")],
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/compounds/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
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
