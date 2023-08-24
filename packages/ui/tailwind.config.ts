import { Config } from "tailwindcss";

module.exports = {
  presets: [require("./tailwind.config.preset.cjs")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        overlayShow: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        contentShow: {
          "0%": {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96);",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -50%) scale(1);",
          },
        },
      },
      animation: {
        animationOverlayShow: `overlayShow 5000ms;`,
        animationContentShow: `contentShow 5000ms;`,
      },
    },
  },
} satisfies Config;
