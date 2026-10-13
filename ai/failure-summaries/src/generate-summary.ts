import fs from "node:fs";
import path from "node:path";

interface FailureArtifact {
  test?: { title?: string; fullTitle?: string; name?: string; project?: string };
  result?: {
    status?: string;
    retry?: number;
    expectedStatus?: string;
    error?: { message?: string; stack?: string; value?: string };
    errors?: Array<{ message?: string; stack?: string; value?: string }>;
  };
  attachments?: string[];
}

export function summarize(artifact: FailureArtifact): string {
  const test = artifact.test ?? {};
  const result = artifact.result ?? {};
  const lines = [
    `Test: ${test.title || test.fullTitle || test.name || "unknown"}`,
    `Project: ${test.project || "unspecified"}`,
    `Attempt status: ${result.status || "unknown"}`,
    `Retry index: ${result.retry ?? 0} (0 = initial attempt)`,
    `Expected status: ${result.expectedStatus || "unspecified"}`,
    "Scope: this attempt only; see run-index.json for final test outcomes.",
  ];
  const errors = result.errors?.length ? result.errors : result.error ? [result.error] : [];
  for (const error of errors) {
    lines.push(`Observed error: ${error.message || error.value || "No error message supplied"}`);
    if (error.stack) lines.push(`Stack: ${error.stack}`);
  }
  if (!errors.length) lines.push("Observed error: no error details supplied by the runner.");
  if (artifact.attachments?.length) {
    lines.push(`Attachments: ${artifact.attachments.join(", ")}`);
  }
  lines.push("Root cause: not determined from the recorded evidence.");
  lines.push("Next step: compare the expected contract with the error and inspect available traces, logs, or response details before changing the test.");
  return lines.join("\n");
}

function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node generate-summary.js <artifact.json> [output-directory]");
    process.exitCode = 2;
    return;
  }
  try {
    const file = path.resolve(arg);
    const artifact: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) {
      throw new Error("Failure artifact must be a JSON object");
    }
    const summary = summarize(artifact as FailureArtifact);
    const artifactsDir = process.argv[3]
      ? path.resolve(process.argv[3])
      : path.resolve(__dirname, "..", "artifacts");
    fs.mkdirSync(artifactsDir, { recursive: true });
    const base = path.basename(file, path.extname(file));
    fs.writeFileSync(path.join(artifactsDir, `${base}-nl-summary.txt`), `${summary}\n`, "utf8");
    console.log(summary);
  } catch (error) {
    console.error("Failed to generate summary:", error instanceof Error ? error.message : error);
    process.exitCode = 2;
  }
}

if (require.main === module) main();
