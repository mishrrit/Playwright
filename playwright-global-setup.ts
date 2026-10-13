import { FullConfig } from "@playwright/test";
import { execSync } from "child_process";
import uiGlobalSetup from "./ui/support/global-setup/global-setup";

export default async function globalSetup(config: FullConfig) {
  try {
    console.log("Running test-plans validator...");
    execSync("node scripts/validate-testplans.js", { stdio: "inherit" });
  } catch (err: any) {
    console.error("Test-plan validation failed:", err.message || err);
    throw err;
  }

  await uiGlobalSetup(config);
}
