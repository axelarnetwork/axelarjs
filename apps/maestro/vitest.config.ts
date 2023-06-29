import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    exclude: ["**/node_modules/**", "**/e2e/**"],
    globals: true,
    setupFiles: resolve(__dirname, "vitest.setup.ts"),
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
