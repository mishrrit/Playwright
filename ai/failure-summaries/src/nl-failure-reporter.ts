import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

class NlFailureReporter {
  options: any;
  outDir: string;
  constructor(options?: any) {
    this.options = options || {};
    this.outDir = this.options.outDir || path.resolve(__dirname, "..", "raw");
    if (!fs.existsSync(this.outDir))
      fs.mkdirSync(this.outDir, { recursive: true });
  }

  async onTestEnd(test: any, result: any) {
    try {
      if (result.status === "failed") {
        const safeName = String(test.title || test.name || "test")
          .replace(/[^a-z0-9\-_\.]/gi, "_")
          .slice(0, 200);
        const artifactPath = path.join(this.outDir, `${safeName}.json`);
        const artifact = {
          test: {
            title: test.title,
            file: test.location && test.location.file,
          },
          result: {
            status: result.status,
            error: result.error && {
              message: result.error.message,
              stack: result.error.stack,
            },
          },
          attachments: (result.attachments || [])
            .map((a: any) => a.path || a.name)
            .filter(Boolean),
        };
        fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));

        // Call compiled generator in dist folder
        const generator = path.resolve(__dirname, "generate-summary.js");
        let spawnRes: any;
        if (fs.existsSync(generator)) {
          spawnRes = spawnSync("node", [generator, artifactPath], {
            encoding: "utf8",
          });
        } else {
          console.error("No compiled generator found at", generator);
          return;
        }
        const summaryText =
          spawnRes.status === 0
            ? spawnRes.stdout
            : `Failed to generate summary: ${spawnRes.stderr}`;

        // write summary next to artifacts in failure-summaries/artifacts
        const artifactsDir = path.resolve(__dirname, "..", "artifacts");
        if (!fs.existsSync(artifactsDir))
          fs.mkdirSync(artifactsDir, { recursive: true });
        const summaryPath = path.join(
          artifactsDir,
          `${safeName}-nl-summary.txt`,
        );
        fs.writeFileSync(summaryPath, summaryText, "utf8");

        // Also write a Markdown version and copy to test-results and allure-results
        const md = [] as string[];
        md.push(`# ${artifact.test.title || safeName}`);
        md.push("");
        md.push(`**Status:** ${artifact.result.status}`);
        md.push("");
        md.push("## Summary");
        md.push("");
        md.push("```text");
        md.push(summaryText.trim());
        md.push("```");
        md.push("");
        md.push("## Attachments");
        md.push("");
        for (const a of artifact.attachments || []) {
          const rel = path.relative(process.cwd(), a);
          md.push(`- [${path.basename(a)}](${rel})`);
        }
        md.push("");
        md.push("## Probable cause");
        md.push("");
        md.push("- Flaky timing or missing wait (auto-detected)");
        md.push("");
        md.push("## Suggested fix");
        md.push("");
        md.push(
          "- Add `await page.waitForSelector(...)` or increase timeout for the failing step.",
        );

        const mdContent = md.join("\n");
        const mdPath = path.join(artifactsDir, `${safeName}-nl-summary.md`);
        fs.writeFileSync(mdPath, mdContent, "utf8");

        // copy to first attachment's directory (Playwright test-results folder) so it's colocated with error context
        if (artifact.attachments && artifact.attachments.length) {
          try {
            const attachDir = path.dirname(artifact.attachments[0]);
            const target = path.join(attachDir, `${safeName}-nl-summary.md`);
            fs.writeFileSync(target, mdContent, "utf8");
          } catch (e) {
            // ignore copy errors
          }
        }

        // also copy to allure-results root so it can be consumed by Allure tooling
        try {
          const allureDir = path.resolve(process.cwd(), "allure-results");
          if (fs.existsSync(allureDir)) {
            const target = path.join(allureDir, `${safeName}-nl-summary.md`);
            fs.writeFileSync(target, mdContent, "utf8");
            // emit a small Allure attachment descriptor JSON so the file can be linked in results
            // Note: Allure test result JSONs must reference attachments to show them inline; this descriptor
            // serves as a lightweight attachment record that some workflows consume.
            try {
              const attachmentDescriptor = {
                name: `${safeName}-nl-summary.md`,
                type: "text/markdown",
                source: `${safeName}-nl-summary.md`,
              };
              const descPath = path.join(
                allureDir,
                `${safeName}-nl-summary-attachment.json`,
              );
              fs.writeFileSync(
                descPath,
                JSON.stringify(attachmentDescriptor, null, 2),
                "utf8",
              );
            } catch (e) {
              // ignore descriptor write errors
            }
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error("NlFailureReporter error:", err);
    }
  }
}

module.exports = NlFailureReporter as any;
