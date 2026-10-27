import { test, expect } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import config from "../../../playwright.config";
import { storageStateProjects } from "../../../ui/support/storage-state/projects";

const projects = config.projects!;
const apps = [
  ["todo-mvc-chromium", "todo-mvc"],
  ["todo-mvc-firefox", "todo-mvc"],
  ["ui-testing-playground-chromium", "ui-testing-playground"],
  ["ui-testing-playground-firefox", "ui-testing-playground"],
  ["orange-hrm-chromium", "orange-hrm"],
  ["practice-test-automation-chromium", "practice-test-automation"],
  ["saucedemo-chromium", "saucedemo"],
  ["demo-web-shop-chromium", "demo-web-shop"],
];

for (const [name, app] of apps) {
  test(`${name} consumes its own freshly generated state`, () => {
    const project = projects.find((entry) => entry.name === name)!;
    const setup = projects.find((entry) => entry.name === `${name}-setup`)!;
    expect(project.dependencies).toContain(setup.name);
    expect(setup.metadata?.storageStateApp).toBe(app);
    expect(setup.testMatch).toBe("**/ui/support/storage-state/storage.setup.ts");
    expect(setup.use?.storageState).toEqual({ cookies: [], origins: [] });
    expect(setup.use?.baseURL).toBe(project.use?.baseURL);
    expect(setup.use?.defaultBrowserType).toBe(project.use?.defaultBrowserType);
    expect(project.use?.storageState).toBe(setup.metadata?.storageStatePath);
    expect(path.basename(project.use?.storageState as string)).toBe(`${name}.json`);
    expect(setup.use).toMatchObject({ trace: "off", screenshot: "off", video: "off" });
  });
}

test("state paths are unique and API tests remain independent", () => {
  const paths = projects.filter((project) => project.name?.endsWith("-setup"))
    .map((project) => project.metadata?.storageStatePath);
  expect(new Set(paths).size).toBe(8);
  const api = projects.find((project) => project.name === "api")!;
  expect(api.dependencies).toBeUndefined();
  expect(api.use?.storageState).toBeUndefined();
});

test("existing consumer settings and dependencies are preserved", () => {
  const [, project] = storageStateProjects("todo-mvc", {
    name: "custom-chromium", dependencies: ["other-setup"], retries: 3,
    testMatch: "**/*.spec.ts", use: { locale: "en-GB" },
  });
  expect(project.dependencies).toEqual(["other-setup", "custom-chromium-setup"]);
  expect(project.retries).toBe(3);
  expect(project.testMatch).toBe("**/*.spec.ts");
  expect(project.use).toMatchObject({ locale: "en-GB" });
});

test("anonymous fixture overrides authenticated project state without launching a browser", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "playwright-storage-fixture-"));
  try {
    const fixture = path.resolve(__dirname, "../../../ui/support/fixtures/anonymous.ts");
    const playwright = require.resolve("@playwright/test");
    fs.writeFileSync(path.join(directory, "anonymous.spec.ts"), `
      import { test, expect } from ${JSON.stringify(fixture)};
      test('starts signed out', async ({ storageState }) => {
        expect(storageState).toEqual({ cookies: [], origins: [] });
      });
    `);
    fs.writeFileSync(path.join(directory, "playwright.config.cjs"), `
      const { defineConfig } = require(${JSON.stringify(playwright)});
      module.exports = defineConfig({
        testDir: '.', reporter: 'line', workers: 1,
        outputDir: ${JSON.stringify(path.join(directory, "results"))},
        use: { storageState: 'must-not-be-loaded.json' }
      });
    `);
    const result = spawnSync(process.execPath, [
      require.resolve("@playwright/test/cli"), "test",
      "--config", path.join(directory, "playwright.config.cjs"),
    ], { cwd: directory, encoding: "utf8", timeout: 10000 });
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
