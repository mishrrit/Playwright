import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { summarize } from "./generate-summary";

interface ReporterOptions {
  outDir?: string;
  artifactsDir?: string;
  allureResultsDir?: string | false;
}

class NlFailureReporter implements Reporter {
  readonly runId = randomUUID();
  readonly outDir: string;
  readonly artifactsDir: string;
  private readonly allureResultsDir: string | false;
  private readonly attempts: Array<{
    test: TestCase;
    artifact: string;
    status: TestResult["status"];
    retry: number;
  }> = [];

  constructor(options: ReporterOptions = {}) {
    this.outDir = path.resolve(options.outDir ?? path.join(__dirname, "..", "raw"), this.runId);
    this.artifactsDir = path.resolve(options.artifactsDir ?? path.join(__dirname, "..", "artifacts"), this.runId);
    this.allureResultsDir = options.allureResultsDir === false
      ? false
      : path.resolve(options.allureResultsDir ?? "allure-results");
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== "failed" && result.status !== "timedOut") return;
    try {
      fs.mkdirSync(this.outDir, { recursive: true });
      fs.mkdirSync(this.artifactsDir, { recursive: true });
      const project = test.parent.project()?.name ?? "";
      const identity = JSON.stringify([test.id, project, test.location, test.titlePath(), test.repeatEachIndex]);
      const hash = createHash("sha256").update(identity).digest("hex").slice(0, 20);
      const title = test.title.replace(/[^a-z0-9_-]/gi, "_").slice(0, 60) || "test";
      const safeName = `${title}-${hash}-retry-${result.retry}`;
      const artifactPath = path.join(this.outDir, `${safeName}.json`);
      const attachments = result.attachments
        .flatMap((attachment) => attachment.path ? [path.resolve(attachment.path)] : []);
      const artifact = {
        runId: this.runId,
        test: {
          id: test.id,
          title: test.title,
          titlePath: test.titlePath(),
          project,
          file: test.location.file,
          line: test.location.line,
          column: test.location.column,
          repeatEachIndex: test.repeatEachIndex,
        },
        result: {
          scope: "attempt",
          status: result.status,
          retry: result.retry,
          expectedStatus: test.expectedStatus,
          duration: result.duration,
          error: result.error,
          errors: result.errors,
        },
        attachments,
        attachmentMetadata: result.attachments.map(({ name, contentType, path: file }) => ({
          name, contentType, path: file,
        })),
      };
      fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`);
      this.attempts.push({ test, artifact: path.basename(artifactPath), status: result.status, retry: result.retry });

      const summary = summarize(artifact);
      fs.writeFileSync(path.join(this.artifactsDir, `${safeName}-nl-summary.txt`), `${summary}\n`, "utf8");
      const fence = "`".repeat(Math.max(3, ...[...summary.matchAll(/`+/g)].map((match) => match[0].length + 1)));
      const writeMarkdown = (directory: string, filename: string) => {
        const links = attachments.map((file) => {
          const relative = path.relative(directory, file).split(path.sep).join("/");
          const href = encodeURI(relative).replace(/\(/g, "%28").replace(/\)/g, "%29");
          const label = path.basename(file).replace(/[\[\]]/g, "_");
          return `- [${label}](${href})`;
        });
        const markdown = [
          `# ${test.title.replace(/[\r\n]/g, " ")}`,
          "", `**Attempt status:** ${result.status}; **retry index:** ${result.retry}`,
          "", "Final test outcome is recorded in the raw run directory's run-index.json.",
          "", "## Recorded evidence", "", `${fence}text`, summary, fence,
          "", "## Attachments", "", ...links, "",
        ].join("\n");
        fs.writeFileSync(path.join(directory, filename), markdown, "utf8");
      };
      writeMarkdown(this.artifactsDir, `${safeName}-nl-summary.md`);

      // External copies need the run ID too because their directories are shared.
      const copyName = `${this.runId}-${safeName}-nl-summary.md`;
      const firstAttachment = attachments.find((file) => fs.existsSync(file));
      const copyDirectories = new Set<string>();
      if (firstAttachment) copyDirectories.add(path.dirname(firstAttachment));
      if (this.allureResultsDir && fs.existsSync(this.allureResultsDir)) {
        copyDirectories.add(this.allureResultsDir);
      }
      for (const directory of copyDirectories) {
        try {
          writeMarkdown(directory, copyName);
        } catch (error) {
          console.error("NlFailureReporter: could not copy summary:", error);
        }
      }
    } catch (error) {
      console.error("NlFailureReporter error:", error);
    }
  }

  onEnd(): void {
    if (!this.attempts.length) return;
    try {
      const attempts = this.attempts.map(({ test, ...attempt }) => ({
        ...attempt,
        testId: test.id,
        project: test.parent.project()?.name ?? "",
        finalOutcome: test.outcome(),
      }));
      fs.writeFileSync(path.join(this.outDir, "run-index.json"), `${JSON.stringify({ runId: this.runId, attempts }, null, 2)}\n`);
    } catch (error) {
      console.error("NlFailureReporter: could not write final outcomes:", error);
    }
  }
}

export = NlFailureReporter;
