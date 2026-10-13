import type { FullConfig } from "@playwright/test";
import { cleanRunArtifacts } from "../../../scripts/clean-ai.js";

export default async function globalSetup(_config: FullConfig): Promise<void> {
  // Playwright already owns cleanup of each project's configured outputDir.
  const result = cleanRunArtifacts({ includeTestResults: false });
  for (const warning of result.warnings) console.warn(`[global-setup] ${warning}`);
  if (result.archivedTo) {
    console.log("[global-setup] archived previous Allure results:", result.archivedTo);
  }
  console.log(`[global-setup] cleaned shared artifacts; retained at most ${result.keepRuns} Allure archives`);
  process.env.PLAYWRIGHT_RUN_STARTED_AT = new Date().toISOString();
}
