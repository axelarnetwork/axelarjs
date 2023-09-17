import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 300000,
    environment: "node",
    exclude: ["**/node_modules/**", "build/**", "**/*.js"],
    globals: true,
    setupFiles: ["dotenv/config"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
