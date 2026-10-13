"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
var import_node_crypto = require("node:crypto");
var import_generate_summary = require("./generate-summary");
class NlFailureReporter {
  constructor(options = {}) {
    this.runId = (0, import_node_crypto.randomUUID)();
    this.attempts = [];
    this.outDir = import_node_path.default.resolve(options.outDir ?? import_node_path.default.join(__dirname, "..", "raw"), this.runId);
    this.artifactsDir = import_node_path.default.resolve(options.artifactsDir ?? import_node_path.default.join(__dirname, "..", "artifacts"), this.runId);
    this.allureResultsDir = options.allureResultsDir === false ? false : import_node_path.default.resolve(options.allureResultsDir ?? "allure-results");
  }
  onTestEnd(test, result) {
    if (result.status !== "failed" && result.status !== "timedOut") return;
    try {
      import_node_fs.default.mkdirSync(this.outDir, { recursive: true });
      import_node_fs.default.mkdirSync(this.artifactsDir, { recursive: true });
      const project = test.parent.project()?.name ?? "";
      const identity = JSON.stringify([test.id, project, test.location, test.titlePath(), test.repeatEachIndex]);
      const hash = (0, import_node_crypto.createHash)("sha256").update(identity).digest("hex").slice(0, 20);
      const title = test.title.replace(/[^a-z0-9_-]/gi, "_").slice(0, 60) || "test";
      const safeName = `${title}-${hash}-retry-${result.retry}`;
      const artifactPath = import_node_path.default.join(this.outDir, `${safeName}.json`);
      const attachments = result.attachments.flatMap((attachment) => attachment.path ? [import_node_path.default.resolve(attachment.path)] : []);
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
          repeatEachIndex: test.repeatEachIndex
        },
        result: {
          scope: "attempt",
          status: result.status,
          retry: result.retry,
          expectedStatus: test.expectedStatus,
          duration: result.duration,
          error: result.error,
          errors: result.errors
        },
        attachments,
        attachmentMetadata: result.attachments.map(({ name, contentType, path: file }) => ({
          name,
          contentType,
          path: file
        }))
      };
      import_node_fs.default.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}
`);
      this.attempts.push({ test, artifact: import_node_path.default.basename(artifactPath), status: result.status, retry: result.retry });
      const summary = (0, import_generate_summary.summarize)(artifact);
      import_node_fs.default.writeFileSync(import_node_path.default.join(this.artifactsDir, `${safeName}-nl-summary.txt`), `${summary}
`, "utf8");
      const fence = "`".repeat(Math.max(3, ...[...summary.matchAll(/`+/g)].map((match) => match[0].length + 1)));
      const writeMarkdown = (directory, filename) => {
        const links = attachments.map((file) => {
          const relative = import_node_path.default.relative(directory, file).split(import_node_path.default.sep).join("/");
          const href = encodeURI(relative).replace(/\(/g, "%28").replace(/\)/g, "%29");
          const label = import_node_path.default.basename(file).replace(/[\[\]]/g, "_");
          return `- [${label}](${href})`;
        });
        const markdown = [
          `# ${test.title.replace(/[\r\n]/g, " ")}`,
          "",
          `**Attempt status:** ${result.status}; **retry index:** ${result.retry}`,
          "",
          "Final test outcome is recorded in the raw run directory's run-index.json.",
          "",
          "## Recorded evidence",
          "",
          `${fence}text`,
          summary,
          fence,
          "",
          "## Attachments",
          "",
          ...links,
          ""
        ].join("\n");
        import_node_fs.default.writeFileSync(import_node_path.default.join(directory, filename), markdown, "utf8");
      };
      writeMarkdown(this.artifactsDir, `${safeName}-nl-summary.md`);
      const copyName = `${this.runId}-${safeName}-nl-summary.md`;
      const firstAttachment = attachments.find((file) => import_node_fs.default.existsSync(file));
      const copyDirectories = /* @__PURE__ */ new Set();
      if (firstAttachment) copyDirectories.add(import_node_path.default.dirname(firstAttachment));
      if (this.allureResultsDir && import_node_fs.default.existsSync(this.allureResultsDir)) {
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
  onEnd() {
    if (!this.attempts.length) return;
    try {
      const attempts = this.attempts.map(({ test, ...attempt }) => ({
        ...attempt,
        testId: test.id,
        project: test.parent.project()?.name ?? "",
        finalOutcome: test.outcome()
      }));
      import_node_fs.default.writeFileSync(import_node_path.default.join(this.outDir, "run-index.json"), `${JSON.stringify({ runId: this.runId, attempts }, null, 2)}
`);
    } catch (error) {
      console.error("NlFailureReporter: could not write final outcomes:", error);
    }
  }
}
module.exports = NlFailureReporter;
