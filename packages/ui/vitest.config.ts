/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: resolve(__dirname, "vitest.setup.ts"),
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
