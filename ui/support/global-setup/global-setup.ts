import type { FullConfig } from "@playwright/test";
import fs from "fs/promises";
import path from "path";

export default async function globalSetup(_config: FullConfig): Promise<void> {
  process.env.PLAYWRIGHT_RUN_STARTED_AT = new Date().toISOString();

  // Clean run-scoped output directories before running tests.
  try {
    const outputDir = ((_config as any).outputDir as string) || "test-results";
    const directories = [
      outputDir,
      "allure-results",
      "ai/failure-summaries/raw",
      "ai/failure-summaries/artifacts",
    ];

    const repoRoot = path.resolve(process.cwd());
    for (const directory of directories) {
      const resolved = path.resolve(process.cwd(), directory);

      if (
        !resolved.startsWith(repoRoot) ||
        resolved === path.parse(resolved).root
      ) {
        console.warn(
          `[global-setup] refusing to remove unsafe path: ${resolved}`,
        );
        continue;
      }

      await fs.rm(resolved, { recursive: true, force: true });
      await fs.mkdir(resolved, { recursive: true });
      console.log(`[global-setup] cleaned output directory: ${resolved}`);
    }
  } catch (e) {
    // Do not fail the setup if cleanup fails
    // eslint-disable-next-line no-console
    console.error("[global-setup] error cleaning test-results:", e);
  }
}
