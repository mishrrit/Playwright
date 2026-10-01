import fs from "fs";
import path from "path";

// Simple generator: reads a failure artifact JSON and prints a short natural-language summary.
// Usage: node generate-summary.js <artifact.json>

function summarize(artifact: any) {
  const lines: string[] = [];
  const test = artifact.test || {};
  const result = artifact.result || {};
  lines.push(`Test: ${test.title || test.fullTitle || test.name || "unknown"}`);
  if (result.error && result.error.message) {
    lines.push(`Error: ${result.error.message}`);
  }
  if (result.error && result.error.stack) {
    const top = String(result.error.stack).split("\n")[0];
    lines.push(`Top stack: ${top}`);
  }
  if (
    artifact.attachments &&
    Array.isArray(artifact.attachments) &&
    artifact.attachments.length
  ) {
    lines.push(`Attachments: ${artifact.attachments.join(", ")}`);
  }
  lines.push("Probable cause: Flaky timing or missing wait");
  lines.push(
    "Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.",
  );
  return lines.join("\n");
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node generate-summary.js <artifact.json>");
    process.exit(2);
  }
  const file = path.resolve(arg);
  if (!fs.existsSync(file)) {
    console.error("File not found:", file);
    process.exit(2);
  }
  try {
    const raw = fs.readFileSync(file, "utf8");
    const artifact = JSON.parse(raw) as any;
    const summary = summarize(artifact);
    console.log(summary);

    // write to artifacts folder next to this script when provided
    const scriptPath =
      process.argv[1] ||
      (typeof __filename !== "undefined" ? __filename : undefined);
    const scriptDir = scriptPath
      ? path.dirname(scriptPath)
      : typeof __dirname !== "undefined"
        ? __dirname
        : process.cwd();
    const artifactsDir = path.resolve(scriptDir, "..", "artifacts");
    if (!fs.existsSync(artifactsDir))
      fs.mkdirSync(artifactsDir, { recursive: true });
    const base = path.basename(file, path.extname(file));
    const outPath = path.join(artifactsDir, `${base}-nl-summary.txt`);
    fs.writeFileSync(outPath, summary, "utf8");
  } catch (err: any) {
    console.error("Failed to generate summary:", err?.message || err);
    process.exit(2);
  }
}

main();
