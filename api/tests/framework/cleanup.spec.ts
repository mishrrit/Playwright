import { test as base, expect } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { cleanRunArtifacts } from "../../../scripts/clean-ai.js";

const repository = path.resolve(__dirname, "../../..");
const cleanupScript = path.join(repository, "scripts/clean-ai.js");
const test = base.extend<{ workspace: string }>({
  workspace: async ({}, use) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "playwright-cleanup-"));
    try {
      await use(directory);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  },
});

function write(root: string, relative: string, content = "preserve this evidence") {
  const file = path.resolve(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

function seed(root: string) {
  write(root, "allure-results/previous.json");
  write(root, "ai/failure-summaries/raw/previous.json");
  write(root, "ai/failure-summaries/artifacts/previous.md");
  write(root, "test-results/previous.txt");
}

function archive(root: string, day: number) {
  const name = `allure-results-2025-01-${String(day).padStart(2, "0")}T00-00-00-000Z`;
  write(root, `allure-archive/${name}/previous.json`);
  return path.join(root, "allure-archive", name);
}

test("importing cleanup has no filesystem side effects", async ({ workspace }) => {
  seed(workspace);
  const before = fs.readFileSync(path.join(workspace, "allure-results/previous.json"), "utf8");
  const result = spawnSync(process.execPath, ["-e", `require(${JSON.stringify(cleanupScript)})`], {
    cwd: workspace, encoding: "utf8",
  });
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toBe("");
  expect(fs.readFileSync(path.join(workspace, "allure-results/previous.json"), "utf8")).toBe(before);
  expect(fs.existsSync(path.join(workspace, "allure-archive"))).toBe(false);
  expect(fs.existsSync(path.join(workspace, "test-results/previous.txt"))).toBe(true);
});

test("archives before cleaning and retains the configured newest managed archives", async ({ workspace }) => {
  seed(workspace);
  const old = archive(workspace, 1);
  const recent = archive(workspace, 2);
  const unrelated = write(workspace, "allure-archive/manual-backup/keep.txt");
  const note = write(workspace, "allure-archive/README.md");
  const source = write(workspace, "api/source.ts");
  const result = cleanRunArtifacts({ rootDir: workspace, keepRuns: "2" });
  expect(result.keepRuns).toBe(2);
  expect(result.removedArchives).toEqual([old]);
  expect(result.archivedTo).toMatch(/allure-results-.*-[0-9a-f-]{36}$/);
  expect(fs.existsSync(path.join(result.archivedTo!, "previous.json"))).toBe(true);
  expect(fs.existsSync(recent)).toBe(true);
  expect(fs.existsSync(unrelated)).toBe(true);
  expect(fs.existsSync(note)).toBe(true);
  expect(fs.existsSync(source)).toBe(true);
  expect(fs.readdirSync(path.join(workspace, "allure-results"))).toEqual([]);
  for (const directory of result.cleaned) expect(fs.readdirSync(directory)).toEqual([]);
});

test("zero retention prunes managed history, never unrelated entries", async ({ workspace }) => {
  seed(workspace);
  const previous = archive(workspace, 1);
  const unrelated = write(workspace, "allure-archive/notes.txt");
  const result = cleanRunArtifacts({ rootDir: workspace, keepRuns: "0" });
  expect(result.removedArchives).toHaveLength(2);
  expect(fs.existsSync(previous)).toBe(false);
  expect(fs.existsSync(result.archivedTo!)).toBe(false);
  expect(fs.existsSync(unrelated)).toBe(true);
});

for (const keepRuns of ["garbage", "-1", "1.5", "3junk", "9007199254740992"]) {
  test(`invalid retention ${keepRuns} falls back to three`, async ({ workspace }) => {
    for (let day = 1; day <= 4; day++) archive(workspace, day);
    const result = cleanRunArtifacts({ rootDir: workspace, keepRuns });
    expect(result.keepRuns).toBe(3);
    expect(result.warnings).toHaveLength(1);
    expect(result.removedArchives).toEqual([path.join(workspace, "allure-archive/allure-results-2025-01-01T00-00-00-000Z")]);
  });
}

test("missing and empty result directories do not create empty archives", async ({ workspace }) => {
  const first = cleanRunArtifacts({ rootDir: workspace, keepRuns: "" });
  expect(first.keepRuns).toBe(3);
  expect(first.archivedTo).toBeUndefined();
  expect(fs.existsSync(path.join(workspace, "allure-archive"))).toBe(false);
  const old = archive(workspace, 1);
  const second = cleanRunArtifacts({ rootDir: workspace, keepRuns: "0" });
  expect(second.archivedTo).toBeUndefined();
  expect(second.removedArchives).toEqual([old]);
});

test("rapid repeated runs produce distinct archives without overwriting evidence", async ({ workspace }) => {
  seed(workspace);
  const first = cleanRunArtifacts({ rootDir: workspace, keepRuns: "3" });
  write(workspace, "allure-results/next.json", "second run");
  const second = cleanRunArtifacts({ rootDir: workspace, keepRuns: "3" });
  expect(first.archivedTo).not.toBe(second.archivedTo);
  expect(fs.readFileSync(path.join(first.archivedTo!, "previous.json"), "utf8")).toBe("preserve this evidence");
  expect(fs.readFileSync(path.join(second.archivedTo!, "next.json"), "utf8")).toBe("second run");
});

test("automatic cleanup leaves Playwright test output ownership untouched", async ({ workspace }) => {
  seed(workspace);
  const result = cleanRunArtifacts({ rootDir: workspace, includeTestResults: false, keepRuns: "3" });
  expect(result.cleaned).toHaveLength(2);
  expect(fs.existsSync(path.join(workspace, "test-results/previous.txt"))).toBe(true);
});

test("archive failure stops cleanup and preserves existing run evidence", async ({ workspace }) => {
  seed(workspace);
  const originalRename = fs.renameSync;
  try {
    fs.renameSync = () => { throw new Error("simulated archive failure"); };
    expect(() => cleanRunArtifacts({ rootDir: workspace, keepRuns: "3" })).toThrow("simulated archive failure");
  } finally {
    fs.renameSync = originalRename;
  }
  for (const file of ["allure-results/previous.json", "ai/failure-summaries/raw/previous.json", "ai/failure-summaries/artifacts/previous.md", "test-results/previous.txt"]) {
    expect(fs.existsSync(path.join(workspace, file))).toBe(true);
  }
});

test("preflight rejects a file where a managed directory is expected before cleanup", async ({ workspace }) => {
  seed(workspace);
  fs.rmSync(path.join(workspace, "ai/failure-summaries/artifacts"), { recursive: true });
  write(workspace, "ai/failure-summaries/artifacts", "not a directory");
  expect(() => cleanRunArtifacts({ rootDir: workspace })).toThrow("Expected cleanup directory");
  expect(fs.existsSync(path.join(workspace, "allure-results/previous.json"))).toBe(true);
  expect(fs.existsSync(path.join(workspace, "ai/failure-summaries/raw/previous.json"))).toBe(true);
});

for (const location of ["ai", "ai/failure-summaries/raw/escape", "allure-archive"]) {
  test(`rejects junction/symlink escape at ${location}`, async ({ workspace }) => {
    const root = path.join(workspace, "root");
    const outside = path.join(workspace, "root-other");
    seed(root);
    write(outside, "keep.txt");
    const link = path.join(root, location);
    fs.rmSync(link, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(link), { recursive: true });
    fs.symlinkSync(outside, link, process.platform === "win32" ? "junction" : "dir");
    expect(() => cleanRunArtifacts({ rootDir: root })).toThrow(/symlink/);
    expect(fs.readFileSync(path.join(outside, "keep.txt"), "utf8")).toBe("preserve this evidence");
    expect(fs.existsSync(path.join(root, "allure-results/previous.json"))).toBe(true);
  });
}

test("rejects a linked managed archive without deleting external evidence", async ({ workspace }) => {
  const root = path.join(workspace, "root");
  const outside = path.join(workspace, "outside");
  seed(root);
  write(outside, "keep.txt");
  const link = path.join(root, "allure-archive/allure-results-2025-01-01T00-00-00-000Z");
  fs.mkdirSync(path.dirname(link));
  fs.symlinkSync(outside, link, process.platform === "win32" ? "junction" : "dir");
  expect(() => cleanRunArtifacts({ rootDir: root, keepRuns: "0" })).toThrow(/symlink/);
  expect(fs.existsSync(path.join(outside, "keep.txt"))).toBe(true);
  expect(fs.existsSync(path.join(root, "allure-results/previous.json"))).toBe(true);
});

test("rejects cleanup rooted at a filesystem root or linked root", async ({ workspace }) => {
  expect(() => cleanRunArtifacts({ rootDir: path.parse(workspace).root })).toThrow("filesystem root");
  const actual = path.join(workspace, "actual");
  seed(actual);
  const link = path.join(workspace, "alias");
  fs.symlinkSync(actual, link, process.platform === "win32" ? "junction" : "dir");
  expect(() => cleanRunArtifacts({ rootDir: link })).toThrow(/symlink/);
  expect(fs.existsSync(path.join(actual, "allure-results/previous.json"))).toBe(true);
});

test("standalone cleanup CLI honors retention and returns nonzero for unsafe paths", async ({ workspace }) => {
  seed(workspace);
  const result = spawnSync(process.execPath, [cleanupScript], {
    cwd: workspace, encoding: "utf8", env: { ...process.env, ALLURE_KEEP_RUNS: "0" },
  });
  expect(result.status, result.stderr).toBe(0);
  expect(fs.readdirSync(path.join(workspace, "test-results"))).toEqual([]);
  expect(fs.readdirSync(path.join(workspace, "allure-archive"))).toEqual([]);
  fs.rmSync(path.join(workspace, "allure-results"), { recursive: true });
  write(workspace, "allure-results", "invalid directory");
  const failed = spawnSync(process.execPath, [cleanupScript], { cwd: workspace, encoding: "utf8" });
  expect(failed.status).toBe(1);
  expect(failed.stderr).toContain("Expected cleanup directory");
});

test("global setup aborts test execution on unsafe cleanup without losing previous results", async ({ workspace }) => {
  seed(workspace);
  fs.rmSync(path.join(workspace, "ai/failure-summaries/artifacts"), { recursive: true });
  write(workspace, "ai/failure-summaries/artifacts", "invalid directory");
  const marker = path.join(workspace, "test-executed.txt");
  write(workspace, "specs/example.spec.js", `
    const { test } = require(${JSON.stringify(require.resolve("@playwright/test"))});
    test('must not execute', async () => {
      require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran');
    });
  `);
  const config = path.join(workspace, "playwright.config.cjs");
  fs.writeFileSync(config, `module.exports = ${JSON.stringify({
    testDir: path.join(workspace, "specs"),
    outputDir: path.join(workspace, "custom-output"),
    globalSetup: path.join(repository, "ui/support/global-setup/global-setup.ts"),
    reporter: "line", workers: 1,
  })};`);
  const result = spawnSync(process.execPath, [path.join(repository, "node_modules/@playwright/test/cli.js"), "test", "--config", config], {
    cwd: workspace, encoding: "utf8", timeout: 10000,
  });
  expect(result.error).toBeUndefined();
  expect(result.status).toBe(1);
  expect(result.stdout + result.stderr).toContain("Expected cleanup directory");
  expect(fs.existsSync(marker)).toBe(false);
  expect(fs.existsSync(path.join(workspace, "allure-results/previous.json"))).toBe(true);
  expect(fs.existsSync(path.join(workspace, "ai/failure-summaries/raw/previous.json"))).toBe(true);
});

for (const mode of ["direct", "npm"] as const) {
  test(`${mode} test entry point runs shared cleanup once and lets Playwright clean custom output`, async ({ workspace }) => {
    test.setTimeout(60000);
    seed(workspace);
    write(workspace, "custom-output/stale.txt");
    fs.mkdirSync(path.join(workspace, "scripts"));
    fs.copyFileSync(path.join(repository, "scripts/validate-testplans.js"), path.join(workspace, "scripts/validate-testplans.js"));
    fs.copyFileSync(cleanupScript, path.join(workspace, "scripts/clean-ai.js"));
    write(workspace, "test-plans/fakerest-books-test-plan.md", "# Test plan fixture");
    const config = path.join(workspace, "playwright.config.cjs");
    fs.writeFileSync(config, `module.exports = ${JSON.stringify({
      testDir: path.join(workspace, "specs"),
      outputDir: path.join(workspace, "custom-output"),
      globalSetup: path.join(repository, "playwright-global-setup.ts"),
      reporter: "line", workers: 1, retries: 0,
    })};`);
    write(workspace, "specs/example.spec.js", `
      const { test, expect } = require(${JSON.stringify(require.resolve("@playwright/test"))});
      const fs = require('node:fs');
      test('isolated setup', async ({}, info) => {
        expect(fs.readdirSync('allure-results')).toEqual([]);
        expect(fs.readdirSync('ai/failure-summaries/raw')).toEqual([]);
        expect(fs.existsSync('test-results/previous.txt')).toBe(true);
        expect(fs.existsSync('custom-output/stale.txt')).toBe(false);
        expect(process.env.PLAYWRIGHT_RUN_STARTED_AT).toBeTruthy();
        fs.writeFileSync(info.outputPath('during-test.txt'), 'new output');
      });
    `);
    const cli = path.join(repository, "node_modules/@playwright/test/cli.js");
    const env = { ...process.env, ALLURE_KEEP_RUNS: "2" };
    let result;
    if (mode === "npm") {
      const sourcePackage = JSON.parse(fs.readFileSync(path.join(repository, "package.json"), "utf8"));
      expect(sourcePackage.scripts.pretest).toBe("npm run build:ai");
      fs.writeFileSync(path.join(workspace, "package.json"), JSON.stringify({ scripts: {
        pretest: sourcePackage.scripts.pretest,
        "build:ai": "node -e \"console.log('BUILD_ONLY_TEST_MARKER')\"",
        "clean:ai": sourcePackage.scripts["clean:ai"],
        test: `node ${JSON.stringify(cli)}`,
      } }));
      // Run npm's JS entry point directly so paths with spaces work on Windows.
      const npmCli = [
        process.env.npm_execpath && path.join(path.dirname(process.env.npm_execpath), "npm-cli.js"),
        path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"),
      ].find((file) => file && fs.existsSync(file));
      expect(npmCli, "npm must be installed to verify npm lifecycle behavior").toBeTruthy();
      result = spawnSync(process.execPath, [npmCli!, "test", "--", "test", "--config", config], {
        cwd: workspace, encoding: "utf8", env, timeout: 45000,
      });
      expect(result.stdout).toContain("BUILD_ONLY_TEST_MARKER");
    } else {
      result = spawnSync(process.execPath, [cli, "test", "--config", config], {
        cwd: workspace, encoding: "utf8", env, timeout: 45000,
      });
    }
    expect(result.error).toBeUndefined();
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout.match(/\[global-setup\] cleaned shared artifacts/g)).toHaveLength(1);
    expect(result.stdout).not.toContain("[clean-ai] cleaned");
    const archives = fs.readdirSync(path.join(workspace, "allure-archive"));
    expect(archives).toHaveLength(1);
    expect(fs.readFileSync(path.join(workspace, "allure-archive", archives[0], "previous.json"), "utf8"))
      .toBe("preserve this evidence");
    expect(fs.existsSync(path.join(workspace, "test-results/previous.txt"))).toBe(true);
  });
}
