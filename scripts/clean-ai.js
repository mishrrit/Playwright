const fs = require("fs");
const path = require("path");

function safeRm(p) {
  const repoRoot = path.resolve(process.cwd());
  const resolved = path.resolve(process.cwd(), p);
  if (
    !resolved.startsWith(repoRoot) ||
    resolved === path.parse(resolved).root
  ) {
    console.warn("[clean-ai] refusing to remove unsafe path:", resolved);
    return;
  }
  try {
    if (fs.existsSync(resolved)) {
      fs.rmSync(resolved, { recursive: true, force: true });
    }
    fs.mkdirSync(resolved, { recursive: true });
    console.log("[clean-ai] cleaned", resolved);
  } catch (e) {
    console.error("[clean-ai] error cleaning", resolved, e);
    process.exitCode = 1;
  }
}

// directories to clean
const dirs = [
  "test-results",
  "allure-results",
  "ai/failure-summaries/raw",
  "ai/failure-summaries/artifacts",
];

for (const d of dirs) safeRm(d);

console.log("clean-ai finished");
