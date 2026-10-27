import type { Project } from "@playwright/test";
import path from "node:path";

export type StorageStateApp =
  | "todo-mvc"
  | "ui-testing-playground"
  | "orange-hrm"
  | "practice-test-automation"
  | "saucedemo"
  | "demo-web-shop";

export function storageStateProjects(app: StorageStateApp, project: Project): Project[] {
  const setupName = `${project.name}-setup`;
  const statePath = path.resolve(__dirname, "../../../playwright/.auth", `${project.name}.json`);

  return [
    {
      name: setupName,
      testMatch: "**/ui/support/storage-state/storage.setup.ts",
      timeout: 60000,
      use: { ...project.use, storageState: { cookies: [], origins: [] }, trace: "off", screenshot: "off", video: "off" },
      metadata: { storageStateApp: app, storageStatePath: statePath },
    },
    {
      ...project,
      dependencies: [...(project.dependencies ?? []), setupName],
      use: { ...project.use, storageState: statePath },
    },
  ];
}
