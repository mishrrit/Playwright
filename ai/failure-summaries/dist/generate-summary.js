"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var generate_summary_exports = {};
__export(generate_summary_exports, {
  summarize: () => summarize
});
module.exports = __toCommonJS(generate_summary_exports);
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
function summarize(artifact) {
  const test = artifact.test ?? {};
  const result = artifact.result ?? {};
  const lines = [
    `Test: ${test.title || test.fullTitle || test.name || "unknown"}`,
    `Project: ${test.project || "unspecified"}`,
    `Attempt status: ${result.status || "unknown"}`,
    `Retry index: ${result.retry ?? 0} (0 = initial attempt)`,
    `Expected status: ${result.expectedStatus || "unspecified"}`,
    "Scope: this attempt only; see run-index.json for final test outcomes."
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
function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node generate-summary.js <artifact.json> [output-directory]");
    process.exitCode = 2;
    return;
  }
  try {
    const file = import_node_path.default.resolve(arg);
    const artifact = JSON.parse(import_node_fs.default.readFileSync(file, "utf8"));
    if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) {
      throw new Error("Failure artifact must be a JSON object");
    }
    const summary = summarize(artifact);
    const artifactsDir = process.argv[3] ? import_node_path.default.resolve(process.argv[3]) : import_node_path.default.resolve(__dirname, "..", "artifacts");
    import_node_fs.default.mkdirSync(artifactsDir, { recursive: true });
    const base = import_node_path.default.basename(file, import_node_path.default.extname(file));
    import_node_fs.default.writeFileSync(import_node_path.default.join(artifactsDir, `${base}-nl-summary.txt`), `${summary}
`, "utf8");
    console.log(summary);
  } catch (error) {
    console.error("Failed to generate summary:", error instanceof Error ? error.message : error);
    process.exitCode = 2;
  }
}
if (require.main === module) main();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  summarize
});
