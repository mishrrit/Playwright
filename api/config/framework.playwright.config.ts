import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "../tests/framework",
  outputDir: "../../test-results/api-framework",
  fullyParallel: true,
  workers: 2,
  reporter: "line",
  timeout: 15000,
});
