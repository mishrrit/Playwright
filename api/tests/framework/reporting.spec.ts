import { test as base, expect } from "@playwright/test";
import type { TestCase, TestResult } from "@playwright/test/reporter";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { validateSchema } from "../../utils/validator";

const root = path.resolve(__dirname, "../../..");
const reporterFile = path.join(root, "ai/failure-summaries/dist/nl-failure-reporter.js");
const generatorFile = path.join(root, "ai/failure-summaries/dist/generate-summary.js");
const Reporter = require(reporterFile) as typeof import("../../../ai/failure-summaries/src/nl-failure-reporter");

const test = base.extend<{ workspace: string }>({
  workspace: async ({}, use) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "playwright-reporting-"));
    try {
      await use(directory);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  },
});

function mockTest(overrides: Partial<TestCase> = {}): TestCase {
  return {
    id: "test-id",
    title: "Same title",
    titlePath: () => ["suite", "Same title"],
    location: { file: "example.spec.ts", line: 1, column: 1 },
    parent: { project: () => ({ name: "alpha" }) },
    repeatEachIndex: 0,
    expectedStatus: "passed",
    outcome: () => "unexpected",
    ...overrides,
  } as unknown as TestCase;
}

function mockResult(overrides: Partial<TestResult> = {}): TestResult {
  const error = { message: "Expected 200, received 404", stack: "Error: HTTP 404" };
  return {
    status: "failed", retry: 0, duration: 10, attachments: [],
    error, errors: [error], ...overrides,
  } as TestResult;
}

function makeReporter(workspace: string) {
  return new Reporter({
    outDir: path.join(workspace, "raw"),
    artifactsDir: path.join(workspace, "summaries"),
    allureResultsDir: false,
  });
}

function readArtifacts(directory: string) {
  return fs.readdirSync(directory)
    .filter((name) => name.endsWith(".json") && name !== "run-index.json")
    .map((name) => JSON.parse(fs.readFileSync(path.join(directory, name), "utf8")));
}

test("artifact identity distinguishes repeat indices and separate runs", async ({ workspace }) => {
  const first = makeReporter(workspace);
  first.onTestEnd(mockTest(), mockResult());
  first.onTestEnd(mockTest({ repeatEachIndex: 1 }), mockResult());
  first.onEnd();
  expect(readArtifacts(first.outDir)).toHaveLength(2);
  const second = makeReporter(workspace);
  second.onTestEnd(mockTest(), mockResult());
  second.onEnd();
  expect(first.outDir).not.toBe(second.outDir);
  expect(readArtifacts(first.outDir)).toHaveLength(2);
  expect(readArtifacts(second.outDir)).toHaveLength(1);
});

test("no failure artifacts or directories for passed, skipped or interrupted attempts", async ({ workspace }) => {
  const reporter = makeReporter(workspace);
  for (const status of ["passed", "skipped", "interrupted"] as const) {
    reporter.onTestEnd(mockTest(), mockResult({ status }));
  }
  reporter.onEnd();
  expect(fs.existsSync(reporter.outDir)).toBe(false);
  expect(fs.existsSync(reporter.artifactsDir)).toBe(false);
});

test("summary copies have valid relative links and never treat inline names as paths", async ({ workspace }) => {
  const allure = path.join(workspace, "allure-results");
  const attachments = path.join(workspace, "test-output");
  fs.mkdirSync(allure);
  fs.mkdirSync(attachments);
  const trace = path.join(attachments, "trace (1).zip");
  fs.writeFileSync(trace, "test trace fixture");
  const reporter = new Reporter({
    outDir: path.join(workspace, "raw"),
    artifactsDir: path.join(workspace, "summaries"),
    allureResultsDir: allure,
  });
  reporter.onTestEnd(mockTest(), mockResult({
    attachments: [
      { name: "inline-not-a-path", contentType: "text/plain", body: Buffer.from("inline") },
      { name: "trace", contentType: "application/zip", path: trace },
    ],
  }));
  const [artifact] = readArtifacts(reporter.outDir);
  expect(artifact.attachments).toEqual([trace]);
  expect(artifact.attachmentMetadata).toHaveLength(2);
  for (const directory of [reporter.artifactsDir, attachments, allure]) {
    const summaries = fs.readdirSync(directory).filter((name) => name.endsWith(".md"));
    expect(summaries).toHaveLength(1);
    const markdown = fs.readFileSync(path.join(directory, summaries[0]), "utf8");
    const target = markdown.match(/\[trace \(1\)\.zip\]\(([^)]+)\)/)?.[1];
    expect(target).toBeDefined();
    expect(path.resolve(directory, decodeURI(target!))).toBe(trace);
    expect(markdown).not.toContain("Flaky timing");
    expect(markdown).not.toContain("increase timeout");
  }
  expect(fs.readdirSync(allure).some((name) => name.endsWith("-attachment.json"))).toBe(false);
});

test("generator reports all evidence without inventing a diagnosis", async ({ workspace }) => {
  const artifact = path.join(workspace, "failure.json");
  const output = path.join(workspace, "output");
  fs.writeFileSync(artifact, JSON.stringify({
    test: { title: "API assertion", project: "api" },
    result: { status: "timedOut", retry: 1, expectedStatus: "passed", errors: [
      { message: "Request timeout", stack: "stack one" },
      { message: "HTTP 404", stack: "stack two" },
    ] },
  }));
  const result = spawnSync(process.execPath, [generatorFile, artifact, output], { encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  const summary = fs.readFileSync(path.join(output, "failure-nl-summary.txt"), "utf8");
  expect(summary).toContain("Attempt status: timedOut");
  expect(summary).toContain("Retry index: 1");
  expect(summary).toContain("Request timeout");
  expect(summary).toContain("HTTP 404");
  expect(summary).toContain("stack two");
  expect(summary).toContain("Root cause: not determined");
  expect(summary).not.toContain("waitForSelector");
  expect(result.stdout.trim()).toBe(summary.trim());
});

test("generator rejects missing input and malformed JSON without success output", async ({ workspace }) => {
  const output = path.join(workspace, "output");
  const invalid = path.join(workspace, "invalid.json");
  fs.writeFileSync(invalid, "{not JSON}");
  for (const args of [[], [path.join(workspace, "missing.json"), output], [invalid, output]]) {
    const result = spawnSync(process.execPath, [generatorFile, ...args], { encoding: "utf8" });
    expect(result.status).toBe(2);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  }
  expect(fs.existsSync(output)).toBe(false);
});

test("real Ajv validates schemas and returns actionable errors", () => {
  const schema = {
    type: "object",
    properties: { id: { type: "integer" }, title: { type: "string" } },
    required: ["id", "title"],
    additionalProperties: false,
  };
  expect(validateSchema(schema, { id: 1, title: "Book" })).toEqual({ valid: true, errors: undefined });
  const invalid = validateSchema(schema, { id: "wrong", extra: true });
  expect(invalid.valid).toBe(false);
  expect(invalid.errors?.map((error) => error.keyword))
    .toEqual(expect.arrayContaining(["required", "additionalProperties", "type"]));
});

test("reporter writes the same summary as the CLI with all subprocess APIs disabled", async ({ workspace }) => {
  const script = `
    const fs = require('node:fs');
    const path = require('node:path');
    const childProcess = require('node:child_process');
    for (const name of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) {
      childProcess[name] = () => { throw new Error('Reporter must not launch subprocesses: ' + name); };
    }
    const Reporter = require(${JSON.stringify(reporterFile)});
    const reporter = new Reporter({
      outDir: ${JSON.stringify(path.join(workspace, "raw"))},
      artifactsDir: ${JSON.stringify(path.join(workspace, "summaries"))},
      allureResultsDir: false,
    });
    reporter.onTestEnd({
      id: 'test-id', title: 'No subprocesses', titlePath: () => ['suite', 'No subprocesses'],
      location: { file: 'example.spec.ts', line: 1, column: 1 },
      parent: { project: () => ({ name: 'api' }) },
      repeatEachIndex: 0, expectedStatus: 'passed', outcome: () => 'unexpected',
    }, {
      status: 'failed', retry: 0, duration: 10, attachments: [],
      errors: [{ message: 'Expected 200, received 404', stack: 'Error: HTTP 404' }],
    });
    reporter.onEnd();
    console.log(JSON.stringify({raw:reporter.outDir, summaries:reporter.artifactsDir}));
  `;
  const result = spawnSync(process.execPath, ["-e", script], { encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  expect(result.stderr).toBe("");
  const directories = JSON.parse(result.stdout);
  const rawName = fs.readdirSync(directories.raw).find((name) => name !== "run-index.json")!;
  const summaryName = fs.readdirSync(directories.summaries).find((name) => name.endsWith(".txt"))!;
  expect(rawName).toBeDefined();
  expect(summaryName).toBeDefined();
  const cliDirectory = path.join(workspace, "cli-output");
  const cli = spawnSync(process.execPath, [generatorFile, path.join(directories.raw, rawName), cliDirectory], { encoding: "utf8" });
  expect(cli.status, cli.stderr).toBe(0);
  const reporterSummary = fs.readFileSync(path.join(directories.summaries, summaryName), "utf8");
  expect(reporterSummary).toContain("Observed error: Expected 200, received 404");
  expect(fs.readFileSync(path.join(cliDirectory, summaryName), "utf8")).toBe(reporterSummary);
});

test("real Playwright failures retain projects, duplicate titles, retries and final outcomes", async ({ workspace }) => {
  test.setTimeout(60000);
  const specs = path.join(workspace, "specs");
  fs.mkdirSync(specs);
  const testImport = `const { test, expect } = require(${JSON.stringify(require.resolve("@playwright/test"))});\n`;
  fs.writeFileSync(path.join(specs, "first.spec.js"), testImport + `
    const fs = require('node:fs');
    test('same title', async ({}, info) => {
      const file = info.outputPath('details.txt');
      fs.writeFileSync(file, 'Expected 200, received 404');
      await info.attach('details', {path:file, contentType:'text/plain'});
      expect(1).toBe(2);
    });
    test('retry succeeds', async ({}, info) => { expect(info.retry).toBeGreaterThan(0); });
    test('timeout', async () => { test.setTimeout(100); await new Promise(() => {}); });
    test('passes', async () => { expect(1).toBe(1); });
    test.skip('skipped', async () => {});
    test('expected failure', async () => { test.fail(); expect(1).toBe(2); });
  `);
  fs.writeFileSync(path.join(specs, "second.spec.js"), testImport + `
    test('same title', async () => { expect(1).toBe(2); });
  `);
  const config = path.join(workspace, "playwright.config.cjs");
  fs.writeFileSync(config, `module.exports = ${JSON.stringify({
    testDir: specs,
    outputDir: path.join(workspace, "results"),
    projects: [{ name: "alpha" }, { name: "beta" }],
    workers: 2,
    retries: 1,
    reporter: [[reporterFile, {
      outDir: path.join(workspace, "raw"),
      artifactsDir: path.join(workspace, "summaries"),
      allureResultsDir: false,
    }]],
  })};`);
  const result = spawnSync(process.execPath, [path.join(root, "node_modules/@playwright/test/cli.js"), "test", "--config", config], {
    cwd: workspace, encoding: "utf8", timeout: 45000, maxBuffer: 5 * 1024 * 1024,
  });
  expect(result.error).toBeUndefined();
  expect(result.status, result.stderr).toBe(1);
  expect(result.stderr).not.toContain("NlFailureReporter");
  const runDirs = fs.readdirSync(path.join(workspace, "raw"));
  expect(runDirs).toHaveLength(1);
  const runDir = path.join(workspace, "raw", runDirs[0]);
  const artifacts = readArtifacts(runDir);
  expect(artifacts).toHaveLength(16);
  const duplicates = artifacts.filter((artifact) => artifact.test.title === "same title");
  expect(duplicates).toHaveLength(8);
  expect(new Set(duplicates.map((artifact) => artifact.test.file)).size).toBe(2);
  expect(new Set(duplicates.map((artifact) => artifact.test.project))).toEqual(new Set(["alpha", "beta"]));
  expect(new Set(duplicates.map((artifact) => artifact.result.retry))).toEqual(new Set([0, 1]));
  expect(artifacts.filter((artifact) => artifact.result.status === "timedOut")).toHaveLength(4);
  const index = JSON.parse(fs.readFileSync(path.join(runDir, "run-index.json"), "utf8"));
  expect(index.attempts.filter((attempt: { finalOutcome: string }) => attempt.finalOutcome === "flaky")).toHaveLength(2);
  expect(index.attempts.filter((attempt: { finalOutcome: string }) => attempt.finalOutcome === "expected")).toHaveLength(2);
  expect(index.attempts.filter((attempt: { finalOutcome: string }) => attempt.finalOutcome === "unexpected")).toHaveLength(12);
  const summaries = fs.readdirSync(path.join(workspace, "summaries", runDirs[0]));
  expect(summaries.filter((name) => name.endsWith(".md"))).toHaveLength(16);
  expect(summaries.filter((name) => name.endsWith(".txt"))).toHaveLength(16);
});
