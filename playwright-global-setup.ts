import { FullConfig } from "@playwright/test";
import { execSync } from "child_process";

export default async function globalSetup(config: FullConfig) {
  try {
    console.log("Running test-plans validator...");
    execSync("node scripts/validate-testplans.js", { stdio: "inherit" });
  } catch (err: any) {
    console.error("Test-plan validation failed:", err.message || err);
    throw err;
  }

  // Delegate to existing UI global setup if present
  try {
    const original = await import("./ui/support/global-setup/global-setup.js");
    if (original && typeof (original as any).default === "function") {
      await (original as any).default(config);
    }
  } catch (e) {
    // If there is no original global setup, ignore
    if (
      (e as any).code === "ERR_MODULE_NOT_FOUND" ||
      (e as any).code === "MODULE_NOT_FOUND"
    ) {
      console.log("No existing UI global setup found, continuing...");
    } else {
      throw e;
    }
  }
}
