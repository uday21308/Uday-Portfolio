import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["scripts/**/*.integration.test.ts"],
    exclude: ["node_modules"],
    testTimeout: 300_000,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
