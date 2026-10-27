import { test as setup } from "@playwright/test";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { prepareStorageState } from "./prepare";
import type { StorageStateApp } from "./projects";

setup("prepare application storage state", async ({ page }, testInfo) => {
  const { storageStateApp, storageStatePath } = testInfo.project.metadata;
  if (typeof storageStateApp !== "string" || typeof storageStatePath !== "string") {
    throw new Error("Storage setup requires an application and output path in project metadata");
  }
  await mkdir(path.dirname(storageStatePath), { recursive: true });
  await rm(storageStatePath, { force: true });
  await prepareStorageState(page, storageStateApp as StorageStateApp);
  await page.context().storageState({ path: storageStatePath, indexedDB: true });
});
