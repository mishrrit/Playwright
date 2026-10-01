import type { FullConfig } from "@playwright/test";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function globalTeardown(
  _config: FullConfig,
): Promise<void> {
  try {
    await execAsync(
      "npx allure generate allure-results -o allure-report --clean",
      { cwd: process.cwd() },
    );
    console.log("[global-teardown] generated Allure report: allure-report");
  } catch (error) {
    console.error("[global-teardown] failed to generate Allure report:", error);
  }

  delete process.env.PLAYWRIGHT_RUN_STARTED_AT;
}
