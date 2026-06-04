import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals:     true,
    environment: "jsdom",
    setupFiles:  ["./vitest.setup.ts"],
    exclude:     ["**/node_modules/**", "**/__tests__/e2e/**"],
    coverage: {
      provider:   "v8",
      reporter:   ["text", "html", "json"],
      include:    ["lib/**", "components/**", "app/api/**"],
      exclude:    ["**/*.d.ts", "**/*.config.*"],
      thresholds: {
        lines:      35,
        functions:  40,
        branches:   25,
        statements: 35,
      },
    },
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
